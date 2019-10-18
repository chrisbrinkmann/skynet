import React, { } from 'react';
import { connect } from 'react-redux';

import Button from '../../components-ui/button/Button';

import style from './post-item.module.scss';

// *************************** POST ITEM COMPONENT *************************** //
const PostItem = ({ post, auth }) => {
  const { id, user_id, content, createdAt, updatedAt } = post;

  return (
    <div className={style.postItem}>

      <p>Post ID:{id} - User ID: {user_id}</p>
      <p>Content: {content}</p>
      <p>Created At: {createdAt} - Updated At: {updatedAt}</p>

    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PostItem);