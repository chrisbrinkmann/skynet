import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getAllUsers } from '../../redux/relations/relations.actions';

import UsersItem from '../users-item/UsersItem';

import style from './users.module.scss';

// *************************** USERS (ALL USERS) COMPONENT *************************** //
const Users = ({ users, auth, getAllUsers }) => {
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className={style.users}>

      <h2 className={style.title}>Skynet Users</h2>
      <div className={style.usersContainer}>
        {
          users.map(user => (
            user.id !== auth.user.id && <UsersItem key={user.id} user={user} />
          ))
        }
      </div>

    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  users: state.relations.users,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  getAllUsers: () => dispatch(getAllUsers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);