import React, { } from 'react';
import style from './form-input.module.scss';

// *************************** FORM INPUT COMPONENT *************************** //
const FormInput = ({ small, onChange, ...otherProps }) => {
  // destructured props passed down via parent component (size / onChange handler / otherProps)
  return (
    <input 
      className={`
        ${small ? style.small : ''}
        ${style.input}
      `}
      onChange={onChange}
      {...otherProps}
    />
  )
};

export default FormInput;