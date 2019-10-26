import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FaCaretRight } from 'react-icons/fa';

import { getUserProfile } from '../../redux/profile/profile.actions';
import { getAllRelations } from '../../redux/relations/relations.actions';

import Spinner from '../../components-ui/spinner/Spinner';
import Button from '../../components-ui/button/Button';

import style from './profile.module.scss';

// *************************** PROFILE COMPONENT *************************** //
const Profile = ({ currentProfile, loading, auth, match, history, getUserProfile, getAllRelations }) => {
  // 'match' passed down as prop from AppRouter
  useEffect(() => {
    getUserProfile(match.params.id);
    getAllRelations();
  }, [getUserProfile, match, getAllRelations]);

  if (currentProfile === null || loading) {
    return (
      <div className={style.profile}>
        <Spinner />
      </div>
    )
  } else {
    return (
      <div className={style.profile}>
        <div className={style.profileContainer}>
  
          <div className={style.profileHeader}>
            <h2 className={style.name}>{currentProfile.name}'s Profile</h2>
            <p className={style.friends}>Friends ({currentProfile.num_friends ? currentProfile.num_friends : 0})</p>
            {
              auth.user.id === currentProfile.id 
                ? <Button warning onClick={() => history.push('/profile/edit')}>Edit Profile</Button>
                : ''
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
              {currentProfile.posts && currentProfile.posts.length > 0
                ? currentProfile.posts
                  .filter((idx, item) => item < 5)
                  .map(post => (
                    <div key={post.id} className={style.post}>
                      <p className={style.postContent}>{post.content}</p>
                    </div>
                ))
                : <p>No posts yet, I'll be back</p>
              }
          </div>
  
          <div className={style.linksContainer}>
            <Link to='/newsfeed' className={style.link}>
              Back To Newsfeed <FaCaretRight className={style.linkIcon} />
            </Link>
          </div>
        </div>
      </div>
    )
  }
};

// REDUX
const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  loading: state.profile.loading,
  auth: state.auth,
  allRelations: state.relations.allRelations,
});

const mapDispatchToProps = (dispatch) => ({
  getUserProfile: (userId) => dispatch(getUserProfile(userId)),
  getAllRelations: () => dispatch(getAllRelations()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));