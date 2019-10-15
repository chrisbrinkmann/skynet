import React, { } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import PageContainer from '../components-page/page-container/PageContainer';
import LandingText from '../components-page/landing-text/LandingText';
import SignUp from '../components-page/sign-up/SignUp';

// *************************** LANDING PAGE *************************** //
const LandingPage = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    // If user is authenticated, Redirect to NewsfeedPage.js
    return <Redirect to='/newsfeed' />
  }

  return (
    <PageContainer landing>
      
      <LandingText />
      <SignUp />

    </PageContainer>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(LandingPage);