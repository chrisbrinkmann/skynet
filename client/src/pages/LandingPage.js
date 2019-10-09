import React, { } from 'react';

import PageContainer from '../components-page/page-container/PageContainer';
import LandingText from '../components-page/landing-text/LandingText';
import SignUp from '../components-page/sign-up/SignUp';

// *************************** LANDING PAGE *************************** //
const LandingPage = () => {
  return (
    <PageContainer landing>
      
      <LandingText />
      <SignUp />

    </PageContainer>
  )
};

export default LandingPage;