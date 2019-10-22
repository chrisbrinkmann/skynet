import React, { } from 'react';
import { IoIosImage, IoMdPaper, IoIosSearch } from 'react-icons/io';
import style from './landing-text.module.scss';

// *************************** LANDING TEXT COMPONENT *************************** //
const LandingText = () => {
  return (
    <div className={style.landingText}>

      <div className={style.header}>
        <h2 className={style.title}>Skynet</h2>
        <h4 className={style.subtitle}>A social network that will take over the world...</h4>
      </div>

      <div className={style.featuresContainer}>
        <img className={style.landingImg} alt='arnold shotgun' src={process.env.PUBLIC_URL + '/assets/arnold_shotgun.png'}/>
        
      </div>

    </div>
  )
};

export default LandingText;