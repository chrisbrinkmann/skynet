import React, { Fragment } from 'react';
import spinner from './spinner.gif';

// *************************** SPINNER COMPONENT *************************** //
const Spinner = () => {
  return (
    <Fragment>
      <img 
        src={spinner}
        style={{ width: '100px', margin: 'auto', display: 'block' }}
        alt='Loading...'
      />
    </Fragment>
  )
};

export default Spinner;