import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getAllPosts } from '../../redux/post/post.actions';

import PostItem from '../post-item/PostItem';

import style from './posts.module.scss';

// *************************** POSTS COMPONENT *************************** //
const Posts = ({ posts, loading, getAllPosts }) => {
  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className={style.posts}>

      {
        posts.map(post => (
          <PostItem post={post} />
        ))
      }

    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  posts: state.post.posts,
  loading: state.post.loading,
});

const mapDispatchToProps = (dispatch) => ({
  getAllPosts: () => dispatch(getAllPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Posts);