import React, { Component } from 'react';
import { Pagination } from 'antd';
import './footer.css';
import PropTypes from 'prop-types';

export default class Footer extends Component {
  static defaultProps = {
    totalPages: 0,
    onChange: () => {},
    currentPage: 1,
  };

  static propTypes = {
    totalPages: PropTypes.number,
    onChange: PropTypes.func,
    currentPage: PropTypes.number,
  };

  render() {
    const { totalPages, onChange, currentPage } = this.props;

    return (
      <div className="pagination-wrapper">
        <Pagination
          current={currentPage}
          total={totalPages}
          pageSize={1}
          onChange={(page) => onChange(page)}
          showSizeChanger={false}
          hideOnSinglePage
          defaultCurrent={1}
        />
      </div>
    );
  }
}
