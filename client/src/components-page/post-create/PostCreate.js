import React, { useState } from 'react';
import { connect } from 'react-redux';

import { addPost } from '../../redux/post/post.actions';

import PageContainer from '../page-container/PageContainer';
import Button from '../../components-ui/button/Button';

import style from './post-create.module.scss';

// *************************** POST CREATE COMPONENT *************************** //
const PostCreate = ({ addPost }) => {
  const [ content, setContent ] = useState('');

  const onChange = (e) => {
    setContent(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addPost({ content });
    setContent('');
  };

  return (
    <PageContainer>

      <form
        onSubmit={(e) => onSubmit(e)}
        className={style.form}
      >
        <textarea 
          className={style.postText}
          name='content'
          placeholder='Create new post'
          value={content}
          onChange={(e) => onChange(e)}
        />
        <Button>Create Post</Button>
      </form>

    </PageContainer>
  )
};

// REDUX
const mapDispatchToProps = (dispatch) => ({
  addPost: ({ content }) => dispatch(addPost({ content })),
});

export default connect(null, mapDispatchToProps)(PostCreate);