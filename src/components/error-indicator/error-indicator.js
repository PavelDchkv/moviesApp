import React from 'react';
import { Alert } from 'antd';

import './error-indicator.css';

const ErrorIndicator = () => {
  return (
    <div className="error-wrapper">
      <Alert message="Error" description="Something went wrong :/" type="error" showIcon />
    </div>
  );
};

export default ErrorIndicator;
