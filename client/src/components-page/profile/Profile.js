import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FaCaretRight } from 'react-icons/fa';

import { getUserProfile } from '../../redux/profile/profile.actions';

import Spinner from '../../components-ui/spinner/Spinner';
import Button from '../../components-ui/button/Button';

import style from './profile.module.scss';

// *************************** PROFILE COMPONENT *************************** //
const Profile = ({ currentProfile, loading, auth, match, getUserProfile }) => {
  // 'match' passed down as prop from AppRouter
  useEffect(() => {
    getUserProfile(match.params.id);
  }, [getUserProfile, match]);

  return (
    <div className={style.profile}>
    {
      currentProfile === null || loading
      ? <Spinner />
      : <div className={style.profileContainer}>

          <div className={style.profileHeader}>
            <h2 className={style.name}>{currentProfile.name}'s Profile</h2>
            <p className={style.friends}>Friends ({currentProfile.num_friends})</p>
            {
              auth.user.id === currentProfile.id 
              ? <Button warning>Edit Profile</Button>
              : <Button success>Friend Request</Button>
            }
          </div>

          <div className={style.profileContent}>
            <img src={currentProfile.avatar} alt={currentProfile.name} className={style.avatar} />
            <div className={style.bioContainer}>
              <h3 className={style.bioHeader}>Bio</h3>
              <p className={style.bio}>{currentProfile.bio ? currentProfile.bio : 'No info'}</p>
            </div>
          </div>

          <div className={style.postsContainer}>
            <h3 className={style.postsHeader}>Recent Posts</h3>
            <div>
              {currentProfile.posts
                .filter((idx, item) => item < 5)
                .map(post => (
                <div key={post.id}>
                  <h4>Post #{post.id}</h4>
                  <p>{post.content}</p>
                  <p>
                    <Link to={`/${post.id}/comments`} className={style.commentsLink}>Comments ({post.comments.length})</Link>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={style.linksContainer}>
            <Link to='/newsfeed' className={style.link}>
              Back To Newsfeed <FaCaretRight className={style.linkIcon} />
            </Link>
          </div>
        </div>
    }
    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  loading: state.profile.loading,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  getUserProfile: (userId) => dispatch(getUserProfile(userId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));