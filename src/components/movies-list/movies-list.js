import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorIndicator from '../error-indicator';
import Spinner from '../spinner';
import Movie from '../movie';
import './movies-list.css';

export default class MoviesList extends Component {
  static defaultProps = {
    moviesArr: [],
    loading: false,
    error: false,
    isEmpty: false,
    onRateMovie: () => {},
  };

  static propTypes = {
    moviesArr: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    isEmpty: PropTypes.bool,
    onRateMovie: PropTypes.func,
  };

  render() {
    const { moviesArr, loading, error, isEmpty, onRateMovie } = this.props;

    if (error) return <ErrorIndicator />;

    if (loading) return <Spinner />;

    if (isEmpty) return <p className="no-result">К сожалению, по вашему запросу ничего не найдено... =(</p>;

    const moviesList = moviesArr.map((movie) => (
      <li key={movie.id}>
        <Movie {...movie} onRateMovie={onRateMovie} />
      </li>
    ));

    return <ul className="movies-list">{moviesList}</ul>;
  }
}
