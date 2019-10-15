import React, { useState } from 'react';
import { connect } from 'react-redux';

import { setAlert } from '../../redux/alert/alert.actions';
import { registerUser } from '../../redux/auth/auth.actions';

import FormInput from '../../components-ui/form-input/FormInput';
import Button from '../../components-ui/button/Button';

import style from './sign-up.module.scss';

// ************************** SIGN UP COMPONENT ************************** //
const SignUp = ({ setAlert, registerUser }) => {
  const [ formData, setFormData ] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlert('Passwords do not match!', 'danger', 2000);
    } else {
      registerUser({ name, email, password });
    }
  };

  return (
    <div className={style.signup}>

      <div className={style.header}>
        <h2 className={style.title}>Sign Up</h2>
        <h3 className={style.subtitle}>Create your account below</h3>
      </div>

      <form onSubmit={onSubmit} className={style.form}>
        <FormInput
          type='text'
          name='name' 
          placeholder='Username'
          value={name}
          onChange={onChange}
        />
        <FormInput
          type='email'
          name='email' 
          placeholder='Email'
          value={email}
          onChange={onChange}
          required
        />
        <FormInput 
          type='password'
          name='password'
          placeholder='Password'
          value={password}
          onChange={onChange}
          required
        />
        <FormInput 
          type='password'
          name='confirmPassword'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={onChange}
          required
        />
        <Button>Sign Up</Button>
      </form>
    </div>
  )
};

// REDUX
const mapDispatchToProps = (dispatch) => ({
  setAlert: (msg, alertType, timeout) => dispatch(setAlert(msg, alertType, timeout)),
  registerUser: ({ name, email, password }) => dispatch(registerUser({ name, email, password })),
});

export default connect(null, mapDispatchToProps)(SignUp);