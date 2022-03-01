import React, { Component } from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import PropTypes from 'prop-types';

import { Consumer } from '../jenres-context';
import './movie.css';
import imageCap from '../../img/image-cap.png';

export default class Movie extends Component {
  static defaultProps = {
    title: '',
    overview: '',
    release_date: '',
    vote_average: 5,
    poster_path: '',
    id: '',
    genre_ids: [],
  };

  static propTypes = {
    title: PropTypes.string,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
    id: PropTypes.number,
    genre_ids: PropTypes.array,
  };

  state = {
    rating: localStorage.getItem(this.props.id),
  };

  getShortText(text, maxSymbols) {
    if (text.length <= maxSymbols) return text;

    const lastIndex = text.lastIndexOf(' ', maxSymbols);
    if (lastIndex === -1) return '';

    let shortText = text.slice(0, lastIndex);

    const punctMarks = '.,!?:!';
    while (punctMarks.includes(shortText.slice(-1))) {
      shortText = shortText.slice(0, -1);
    }

    return `${shortText}...`;
  }

  onRate = (rating) => {
    const { onRateMovie, id } = this.props;
    onRateMovie(id, rating);
    this.setState({ rating });
  };

  render() {
    const { title, overview, release_date, poster_path, vote_average, genre_ids } = this.props;

    const rating = Number(this.state.rating);

    const formattedDate = release_date ? format(new Date(release_date), 'MMMM d, y') : '';

    const maxSymbols = title.length > 40 ? 75 : 105;
    const shortText = this.getShortText(overview, maxSymbols);
    const urlImg = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : imageCap;

    let ratingClassName = 'movie__rating';
    if (vote_average <= 3) {
      ratingClassName += ' movie__rating--D-grade ';
    } else if (vote_average <= 5) {
      ratingClassName += ' movie__rating--C-grade ';
    } else if (vote_average <= 7) {
      ratingClassName += ' movie__rating--B-grade ';
    } else {
      ratingClassName += ' movie__rating--A-grade ';
    }

    return (
      <Consumer>
        {(genres) => {
          const genresArr = genres.reduce((arr, current) => {
            genre_ids.forEach((id) => {
              if (id === current.id) arr.push(current.name);
            });
            return arr;
          }, []);

          const genresList = genresArr.map((genre) => {
            return (
              <li key={genre} className="movie__genre">
                {genre}
              </li>
            );
          });

          return (
            <div className="movie">
              <img className="movie__poster" src={urlImg} alt={title} />
              <div className="movie__main">
                <h2 className="movie__title">{title}</h2>
                <p className="movie__release-date">{formattedDate}</p>
                <ul className="movie__genres-list">{genresList}</ul>
                <p className="movie__overview">{shortText}</p>
                <div className={ratingClassName}>{vote_average}</div>
                <Rate
                  allowHalf
                  value={rating}
                  style={{ fontSize: 17 }}
                  count={10}
                  onChange={(rat) => this.onRate(rat)}
                  disabled={this.state.rating !== null}
                />
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
