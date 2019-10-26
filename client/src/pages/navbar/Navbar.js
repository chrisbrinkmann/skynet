import React, { Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutUser } from '../../redux/auth/auth.actions';

import SignIn from '../../components-page/sign-in/SignIn';

import style from './navbar.module.scss';

// *************************** NAVBAR COMPONENT *************************** //
const Navbar = ({ isAuthenticated, logoutUser, user }) => {
  
  let userId = ''

  if (user !== null) {
    userId = user.id
  }
  
  const authLinks = (
    <ul className={style.links}>
      <li>
        <NavLink to='/friends' className={style.link} activeClassName={style.active}>Friends</NavLink>
      </li>
      <li>
        <NavLink to={`/profile/${userId}`} className={style.link} activeClassName={style.active}>Profile</NavLink>
      </li>
      <li>
        <NavLink to='/users' className={style.link} activeClassName={style.active}>Users</NavLink>
      </li>
      <span onClick={(e) => logoutUser(e)} className={style.link}>Logout</span>
    </ul>
  );

  return (
    <nav className={style.navbar}>

      <Fragment>
        <Link className={style.logoContainer}to='/'>
          <img className={style.logoImg} src={process.env.PUBLIC_URL + 'assets/skull_toon.png'} alt='skull toon'/>
          <h1 className={style.logo}>SKYNET</h1>
        </Link>
      </Fragment>

      {/*authLinks rendered when isAuthenticated === true | SignIn rendered if false */}
      {
        isAuthenticated ? authLinks : <SignIn />
      }
      
    </nav>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);