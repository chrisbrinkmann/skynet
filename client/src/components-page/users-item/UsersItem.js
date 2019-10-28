import React, { } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getAllRelations, sendFriendRequest } from '../../redux/relations/relations.actions';
 
import Button from '../../components-ui/button/Button';

import style from './users-item.module.scss';

// *************************** USER ITEM COMPONENT *************************** //
const UsersItem = ({ user, auth, allRelations, getAllRelations, sendFriendRequest, friendsList }) => {
  // 'user' passed down as prop from Users.js component
  const { id, name, avatar } = user;

  const areFriends = () => {
    const friendIds = friendsList.map(friend => {
      return friend.id
    })

    return friendIds.includes(id)
  }

  const arePending = () => {
    const pendingRelations = allRelations.filter(rel => rel.relationType !== 'friends')

    return pendingRelations.find(rel => {
      let result = false
      
      if (rel.first_user_id === auth.user.id && rel.second_user_id === id) {
        result = true
      }

      if (rel.second_user_id === auth.user.id && rel.first_user_id === id) {
        result = true
      }

      return result
    })
  }

  const onFriendRequest = async () => {
    await sendFriendRequest(id);
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
            {
              areFriends() ? <Button success medium>Friends</Button>
                : arePending() ? <Button warning medium>Pending</Button>
                  : <Button onClick={() => onFriendRequest(id)} link medium>Add Friend</Button>
            }
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
  allRelations: state.relations.allRelations,
});

const mapDispatchToProps = (dispatch) => ({
  getAllRelations: () => dispatch(getAllRelations()),
  sendFriendRequest: (friendId) => dispatch(sendFriendRequest(friendId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersItem);