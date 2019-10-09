import React, { useState } from 'react';

import FormInput from '../../components-ui/form-input/FormInput';
import Button from '../../components-ui/button/Button';

import style from './sign-up.module.scss';

// ************************** SIGN UP COMPONENT ************************** //
const SignUp = () => {
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
      alert('Passwords do not match!')
    }
  };

  return (
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
  )
};

export default SignUp;