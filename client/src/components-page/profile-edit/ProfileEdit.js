import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FormInput from '../../components-ui/form-input/FormInput';
import Button from '../../components-ui/button/Button';

import style from './profile-edit.module.scss';

// *************************** PROFILE EDIT COMPONENT *************************** //
const ProfileEdit = () => {
  return (
    <div className={style.profileEdit}>
      PROFILE EDIT PAGE
    </div>
  )
};

export default ProfileEdit;