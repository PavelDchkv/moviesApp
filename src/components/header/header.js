import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import './header.css';

export default class Header extends Component {
  static defaultProps = {
    onInputChange: () => {},
  };

  static propTypes = {
    onInputChange: PropTypes.func,
  };

  state = {
    inputValue: '',
  };

  onInputChange = (ev) => {
    const searchLine = ev.target.value;
    this.setState({
      inputValue: searchLine,
    });
    this.searchMovies();
  };

  searchMovies = debounce(() => {
    if (!this.state.inputValue) return;
    this.props.onInputChange(this.state.inputValue);
  }, 600);

  render() {
    return (
      <input
        className="search-line"
        onChange={this.onInputChange}
        value={this.state.inputValue}
        placeholder="Type to search..."
        autoFocus
      />
    );
  }
}
