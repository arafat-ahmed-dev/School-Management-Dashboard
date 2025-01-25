import React from 'react';
import Error from 'next/error';

class MyError extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
  }

  render() {
    return (
      <Error statusCode={this.props.statusCode} />
    );
  }
}

export default MyError;
