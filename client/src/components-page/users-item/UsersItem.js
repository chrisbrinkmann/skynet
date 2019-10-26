import React, { } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getAllFriends, getAllRelations, sendFriendRequest, declineOrUnfriend } from '../../redux/relations/relations.actions';
 
import Button from '../../components-ui/button/Button';

import style from './users-item.module.scss';

// *************************** USER ITEM COMPONENT *************************** //
const UsersItem = ({ user, auth, getAllRelations, getAllFriends, sendFriendRequest, declineOrUnfriend }) => {
  // 'user' passed down as prop from Users.js component
  const { id, name, avatar } = user;

  const onFriendRequest = async () => {
    await sendFriendRequest(id);
    await getAllRelations();
  };

  const onDeclineOrUnfriend = async () => {
    await declineOrUnfriend(id);
    await getAllFriends();
    await getAllRelations();
  };

  return (
    <div className={style.usersItem}>
      {
        auth.user.id !== id && 
          <div className={style.user}>
            <img src={avatar} alt={name} className={style.avatar} />
            <p className={style.name}>
              <Link to={`/profile/${id}`} className={style.nameLink}>
                {name}
              </Link>
            </p>
            <div className={style.buttons}>
              <Button onClick={() => onFriendRequest(id)} warning medium>Add Friend</Button>
              <Button onClick={() => onDeclineOrUnfriend(id)} warning medium>Unfriend</Button>
            </div>
          </div>
      }
    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  auth: state.auth,
  friendsList: state.relations.friendsList,
  relationships: state.relations.relationships,
  allRelations: state.relations.allRelations,
});

const mapDispatchToProps = (dispatch) => ({
  getAllFriends: () => dispatch(getAllFriends()),
  getAllRelations: () => dispatch(getAllRelations()),
  sendFriendRequest: (friendId) => dispatch(sendFriendRequest(friendId)),
  declineOrUnfriend: (friendId) => dispatch(declineOrUnfriend(friendId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersItem);