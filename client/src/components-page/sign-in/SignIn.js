import React, { useState } from 'react';
import { connect } from 'react-redux';

import { setAlert } from '../../redux/alert/alert.actions';
import { loginUser } from '../../redux/auth/auth.actions';

import FormInput from '../../components-ui/form-input/FormInput';
import Button from '../../components-ui/button/Button';

import style from './sign-in.module.scss';

// *************************** SIGN IN COMPONENT *************************** //
const SignIn = ({ loginUser }) => {
  const [ formData, setFormData ] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password);
  };

  return (
    <form onSubmit={onSubmit} className={style.form}>
      <FormInput
        small 
        type='email'
        name='email'
        placeholder='Email'
        value={email}
        onChange={onChange}
        autoComplete='off'
      />
      <FormInput 
        small
        type='password'
        name='password'
        placeholder='Password'
        value={password}
        onChange={onChange}
        autoComplete='off'
      />
      <Button small>Log In</Button>
    </form>
  )
};

// REDUX
const mapDispatchToProps = (dispatch) => ({
  setAlert: (msg, alertType, timeout) => dispatch(setAlert(msg, alertType, timeout)),
  loginUser: (email, password) => dispatch(loginUser(email, password)),
});

export default connect(null, mapDispatchToProps)(SignIn);