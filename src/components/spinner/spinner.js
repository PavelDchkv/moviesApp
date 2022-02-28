import React from 'react';
import { Spin } from 'antd';

import './spinner.css';

const Spinner = () => {
  return (
    <div className="spinner-wrapper">
      <Spin className="spinner" />;
    </div>
  );
};

export default Spinner;
