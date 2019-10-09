import React, { useState } from 'react';

import FormInput from '../../components-ui/form-input/FormInput';
import Button from '../../components-ui/button/Button';

import style from './sign-in.module.scss';

// *************************** SIGN IN COMPONENT *************************** //
const SignIn = () => {
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
    console.log('Submitted');
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

export default SignIn;