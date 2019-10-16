import React, { } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// *************************** PRIVATE ROUTE *************************** //
const PrivateRoute = ({ component: Component, isAuthenticated, loading, ...otherProps }) => {
  return (
    <Route 
      {...otherProps}
      render={props => !isAuthenticated
        ? (<Redirect to='/' />)
        : (<Component {...props} />)
      }
    />
  )
};

// REDUX
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(PrivateRoute);