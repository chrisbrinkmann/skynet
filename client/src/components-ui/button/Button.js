import React, { } from 'react';
import style from './button.module.scss';

// *************************** BUTTON COMPONENT *************************** //
const Button = ({ small, medium, inverted, success, danger, link, warning, children, ...otherProps }) => {
  // destructured props will be passed down via parent component (determines size / color / children / otherProps)
  // size and color variables can be chained together
  return (
    <button
      className={`
        ${small ? style.small : ''}
        ${medium ? style.medium : ''}
        ${inverted ? style.inverted : ''}
        ${success ? style.success : ''}
        ${danger ? style.danger : ''}
        ${warning ? style.warning : ''}
        ${link ? style.link : ''}
        ${style.button}
      `}
      {...otherProps}
    >
      {children}
    </button>
  )
};

export default Button;