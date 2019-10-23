import React, { useState } from 'react';
import { connect } from 'react-redux';

import { getNewsfeed, addComment } from '../../redux/post/post.actions';

import Button from '../../components-ui/button/Button';

import style from './comment-create.module.scss';

// *************************** COMMENT CREATE COMPONENT *************************** //
const CommentCreate = ({ postId, addComment, getNewsfeed }) => {
  const [ comment, setComment ] = useState('');

  const onChange = (e) => {
    setComment(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await addComment(postId, {content: comment})
    setComment('');
    await getNewsfeed();
  };

  return (
    <div className={style.commentCreate}>

      <form onSubmit={(e) => onSubmit(e)} className={style.form}>
        <textarea
          className={style.commentText} 
          placeholder='Add comment...'
          name='comment'
          value={comment}
          onChange={(e) => onChange(e)}
        />
        <Button medium>Add Comment</Button>
      </form>

    </div>
  )
};

// REDUX
const mapDispatchToProps = (dispatch) => ({
  addComment: (postId, formData) => dispatch(addComment(postId, formData)),
  getNewsfeed: () => dispatch(getNewsfeed()),
});

export default connect(null, mapDispatchToProps)(CommentCreate);