import React, { } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { MdDeleteForever } from "react-icons/md";

import { getNewsfeed, deleteComment } from '../../redux/post/post.actions';

import style from './comment-item.module.scss';

// *************************** COMMENT ITEM COMPONENT *************************** //
const CommentItem = ({ user, comment, deleteComment, getNewsfeed }) => {
  const { id, user_id, user_name, user_avatar, content } = comment;

  const onDelete = async (e) => {
    e.preventDefault();
    await deleteComment(id);
    await getNewsfeed();
  };

  return (
    <div className={style.commentItem}>

      <img src={user_avatar} alt={user_name} className={style.avatar} />

      <div className={style.commentContent}>
        <Link to={`/profile/${user_id}`}>
          <p className={style.name}>{user_name}</p>
        </Link>
        <p className={style.content}>{content}</p>
      </div>

      {/* If logged in user id === comment's user id, option to delete comment will show */}
      {
        user.id === user_id && <MdDeleteForever onClick={(e) => onDelete(e)} className={style.deleteIcon} />
      }

    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  deleteComment: (commentId) => dispatch(deleteComment(commentId)),
  getNewsfeed: () => dispatch(getNewsfeed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentItem);