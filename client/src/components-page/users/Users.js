import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getAllUsers, setSearchField } from '../../redux/relations/relations.actions';

import SearchField from '../../components-ui/search-field/SearchField';
import UsersItem from '../users-item/UsersItem';

import style from './users.module.scss';

// *************************** USERS (ALL USERS) COMPONENT *************************** //
const Users = ({ users, searchField, auth, getAllUsers, setSearchField }) => {
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchField.toLowerCase());
  });

  return (
    <div className={style.users}>

      <h2 className={style.title}>Skynet Users</h2>

      <SearchField setSearchField={setSearchField} />

      <div className={style.usersContainer}>
        {
          filteredUsers.map(user => (
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
  searchField: state.relations.searchField,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  getAllUsers: () => dispatch(getAllUsers()),
  setSearchField: (e) => dispatch(setSearchField(e.target.value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);