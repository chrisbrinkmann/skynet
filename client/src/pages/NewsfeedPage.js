import React, { } from 'react';

import PageContainer from '../components-page/page-container/PageContainer';
import PostCreate from '../components-page/post-create/PostCreate';
import Posts from '../components-page/posts/Posts';

// *************************** NEWSFEED PAGE *************************** //
const NewsfeedPage = () => {
  return (
    <PageContainer>
      
      <PostCreate />
      <Posts />

    </PageContainer>
  )
};

export default NewsfeedPage;