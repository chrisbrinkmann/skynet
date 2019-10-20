import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getNewsfeed } from '../../redux/post/post.actions';

import NewsfeedItem from '../newsfeed-item/NewsfeedItem';

import style from './newsfeed.module.scss';

// *************************** NEWSFEED COMPONENT *************************** //
const Newsfeed = ({ user, newsfeed, getNewsfeed }) => {
  useEffect(() => {
    getNewsfeed();
  }, [getNewsfeed]);

  return (
    <div className={style.newsfeed}>
      <h2 className={style.title}>{!user ? 'Anonymous' : user.name}'s Newsfeed</h2>
      {
        newsfeed.map(item => (
          <NewsfeedItem key={item.id} item={item} />
        ))
      }
    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  user: state.auth.user,
  newsfeed: state.post.newsfeed,
});

const mapDispatchToProps = (dispatch) => ({
  getNewsfeed: () => dispatch(getNewsfeed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Newsfeed);