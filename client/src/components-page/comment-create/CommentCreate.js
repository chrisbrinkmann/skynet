import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../components-ui/button/Button';

import style from './comment-create.module.scss';

// *************************** COMMENT CREATE COMPONENT *************************** //
const CommentCreate = () => {
  const [ comment, setComment ] = useState('');

  const onChange = (e) => {
    setComment(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setComment('');
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

});

export default connect(null, mapDispatchToProps)(CommentCreate);