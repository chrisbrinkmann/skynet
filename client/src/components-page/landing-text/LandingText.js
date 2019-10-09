import React, { } from 'react';
import { IoIosImage, IoMdPaper, IoIosSearch } from 'react-icons/io';
import style from './landing-text.module.scss';

// *************************** LANDING TEXT COMPONENT *************************** //
const LandingText = () => {
  return (
    <div className={style.landingText}>

      <div className={style.header}>
        <h2 className={style.title}>Skynet</h2>
        <h4 className={style.subtitle}>Some tagline or subtitle</h4>
      </div>

      <div className={style.featuresContainer}>
        <p className={style.feature}>
          <IoIosImage className={style.icon} />
          Generic text statement about a feature.
        </p>
        <p className={style.feature}>
          <IoMdPaper className={style.icon} />
          Another statement ranting and raving about a feature.
        </p>
        <p className={style.feature}>
          <IoIosSearch className={style.icon} />
          Are there three features worth mentioning? Maybe, maybe not.
        </p>
      </div>

    </div>
  )
};

export default LandingText;