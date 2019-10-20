import React, { } from 'react';

import PageContainer from '../components-page/page-container/PageContainer';
import PostCreate from '../components-page/post-create/PostCreate';
import Newsfeed from '../components-page/newsfeed/Newsfeed';

// *************************** NEWSFEED PAGE *************************** //
const NewsfeedPage = () => {
  return (
    <PageContainer>
      
      <PostCreate />
      <Newsfeed />

    </PageContainer>
  )
};

export default NewsfeedPage;