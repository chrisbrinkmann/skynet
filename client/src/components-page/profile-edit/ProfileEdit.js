import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FaCaretRight } from 'react-icons/fa';

import { loadUser } from '../../redux/auth/auth.actions';
import { getUserProfile, updateProfile } from '../../redux/profile/profile.actions';

import FormInput from '../../components-ui/form-input/FormInput';
import Button from '../../components-ui/button/Button';

import style from './profile-edit.module.scss';

// *************************** PROFILE EDIT COMPONENT *************************** //
const ProfileEdit = ({ currentProfile, getUserProfile, updateProfile, loadUser, history }) => {
  useEffect(() => {
    getUserProfile(currentProfile.id);
    setFormData({
      name: currentProfile.name ? currentProfile.name : '',
      bio: currentProfile.bio ? currentProfile.bio : '',
    })
    loadUser();
  }, [getUserProfile, currentProfile.id, currentProfile.name, currentProfile.bio, loadUser]);

  const [ formData, setFormData ] = useState({
    name: '',
    bio: '',
  });

  const { name, bio } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    await getUserProfile(currentProfile.id);
    await loadUser();
    history.replace('/profile/edit');
  };

  return (
    <div className={style.profileEdit}>
      
      <form onSubmit={(e) => onSubmit(e)} className={style.form}>
        <p className={style.header}>Update Name</p>
        <FormInput 
          type='text'
          name='name'
          value={name}
          onChange={(e) => onChange(e)}
        />
        <p className={style.header}>Update Bio</p>
        <textarea
          className={style.bio}
          name='bio'
          value={bio}
          onChange={(e) => onChange(e)}
        />
        <Button success>Update Profile</Button>
      </form>

      <div className={style.linksContainer}>
        <span onClick={() => history.push(`/profile/${currentProfile.id}`)} className={style.link}>
          Back To Newsfeed <FaCaretRight className={style.linkIcon} />
        </span>
      </div>

    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
});

const mapDispatchToProps = (dispatch) => ({
  getUserProfile: (id) => dispatch(getUserProfile(id)),
  updateProfile: (data) => dispatch(updateProfile(data)),
  loadUser: () => dispatch(loadUser()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileEdit));