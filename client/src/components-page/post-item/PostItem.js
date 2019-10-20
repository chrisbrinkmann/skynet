import React, { } from 'react';
import { connect } from 'react-redux';

import { deletePost } from '../../redux/post/post.actions';

import Button from '../../components-ui/button/Button';

import style from './post-item.module.scss';

// *************************** POST ITEM COMPONENT *************************** //
const PostItem = ({ post, auth, deletePost }) => {
  const { id, user_id, content, createdAt, updatedAt } = post;

  return (
    <div className={style.postItem}>

      <p>Post ID:{id} - User ID: {user_id}</p>
      <p>Content: {content}</p>
      <p>Created At: {createdAt} - Updated At: {updatedAt}</p>

      {
        auth.user.id === user_id && 
        <Button onClick={() => deletePost(id)} danger>Delete Post</Button>
      }

    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  deletePost: (postId) => dispatch(deletePost(postId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostItem);