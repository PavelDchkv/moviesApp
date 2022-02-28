import React, { Component } from 'react';
import { Tabs } from 'antd';

import { Provider } from '../jenres-context';
import './app.css';
import MovieDBService from '../../services/movieDB-api';
import Header from '../header';
import MoviesList from '../movies-list';
import Footer from '../footer';

export default class App extends Component {
  movieService = new MovieDBService();
  state = {
    moviesArr: [],
    ratedMoviesArr: [],
    totalPages: 1,
    searchLine: '',
    currentPage: 1,
    loading: false,
    error: false,
    tab: 'search',
    isEmpty: false,
    guestSessionId: '',
    genres: [],
  };

  componentDidMount() {
    this.movieService
      .getGenres()
      .then((genres) => {
        this.setState({ genres });
      })
      .catch((err) => this.onError(err));
    this.createGuestSession();
    localStorage.clear();
  }

  onChangeTab = (activeTab) => {
    this.setState({
      tab: activeTab,
      currentPage: 1,
      isEmpty: false,
    });

    if (activeTab === 'rated') {
      this.setState({ loading: true });
      this.getRatedMovies();
      return;
    }

    const { searchLine } = this.state;
    if (searchLine) {
      this.setState({ loading: true });
      this.searchMovies(searchLine);
    }
  };

  onChangePage = (page) => {
    this.setState({
      currentPage: page,
    });

    const { searchLine, tab } = this.state;

    if (tab === 'search') {
      this.onSearchLineChange(searchLine, page);
      return;
    }

    this.setState({ loading: true, currentPage: page });
    this.getRatedMovies(page);
  };

  onSearchLineChange = (searchLine, page = 1) => {
    if (!searchLine) {
      this.setState({ searchLine });
      return;
    }
    this.setState({
      loading: true,
      error: false,
      searchLine,
    });
    this.searchMovies(searchLine, page);
  };

  createGuestSession = () => {
    this.movieService
      .getGuestSession()
      .then((res) => {
        this.setState({
          guestSessionId: res.guest_session_id,
        });
      })
      .catch((err) => this.onError(err));
  };

  getRatedMovies = (page = 1) => {
    this.movieService
      .getRatedMovies(this.state.guestSessionId, page)
      .then((res) => {
        this.onMoviesLoaded(res, 'ratedMoviesArr');
      })
      .catch((err) => this.onError(err));
  };

  searchMovies = (searchLine, page = 1) => {
    this.movieService
      .getMovies(searchLine, page)
      .then((res) => {
        this.onMoviesLoaded(res, 'moviesArr');
      })
      .catch((err) => this.onError(err));
  };

  onMoviesLoaded(moviesObj, type) {
    const { results: movies, total_pages: totalPages } = moviesObj;
    if (movies.length === 0) {
      this.setState({
        isEmpty: true,
        loading: false,
        error: false,
      });
      return;
    }
    this.setState({
      [type]: movies,
      totalPages: totalPages,
      loading: false,
      error: false,
      isEmpty: false,
    });
  }

  onRateMovie = (id, rating) => {
    this.movieService.rateMovie(id, rating, this.state.guestSessionId).catch((err) => this.onError(err));
    localStorage.setItem(id, rating);
  };

  onError = (err) => {
    this.setState({
      loading: false,
      error: true,
    });
    console.log(err);
  };

  render() {
    const { moviesArr, ratedMoviesArr, loading, error, totalPages, currentPage, isEmpty, tab, genres } = this.state;
    const { TabPane } = Tabs;
    const isPaginationNecessary = !error && !loading && !isEmpty;

    const movies = (
      <React.Fragment>
        <MoviesList
          moviesArr={tab === 'search' ? moviesArr : ratedMoviesArr}
          loading={loading}
          error={error}
          isEmpty={isEmpty}
          onRateMovie={this.onRateMovie}
        />
        {isPaginationNecessary && (
          <Footer totalPages={totalPages} onChange={this.onChangePage} currentPage={currentPage} />
        )}
      </React.Fragment>
    );

    return (
      <Provider value={genres}>
        <div className="movies-app">
          <Tabs defaultActiveKey="search" onChange={(key) => this.onChangeTab(key)} centered>
            <TabPane tab="Search" key="search">
              <Header onInputChange={this.onSearchLineChange} />
              {movies}
            </TabPane>
            <TabPane tab="Rated" key="rated">
              {movies}
            </TabPane>
          </Tabs>
        </div>
      </Provider>
    );
  }
}
