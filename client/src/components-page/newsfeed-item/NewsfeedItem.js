import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { deletePost } from '../../redux/post/post.actions';
import { getNewsfeed } from '../../redux/post/post.actions';

import Button from '../../components-ui/button/Button';

import style from './newsfeed-item.module.scss';

// *************************** NEWSFEED ITEM COMPONENT *************************** //
const NewsfeedItem = ({ item, auth, deletePost, getNewsfeed }) => {
  useEffect(() => {
    getNewsfeed();
  }, [getNewsfeed]);
  
  const { id, user_id, user_name, user_avatar, content, comments } = item;

  return (
    <div className={style.newsfeedItem}>

      <div className={style.userContainer}>
        <img src={user_avatar} alt={user_name} className={style.avatar} />
        <p className={style.postedBy}>
          Posted by <Link to={`/profile/${user_id}`} className={style.profileLink}>{user_name}</Link>
        </p>
      </div>

      <div className={style.contentContainer}>
        <p className={style.content}>{content}</p>
        <Link to={`/${id}/comments`} className={style.commentsLink}>
          Comments ({comments && comments.length > 0 ? comments.length : 0})
        </Link>
      </div>

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
  getNewsfeed: () => dispatch(getNewsfeed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsfeedItem);