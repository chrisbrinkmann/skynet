import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { declineOrUnfriend, getAllFriends  } from '../../redux/relations/relations.actions';

import Button from '../../components-ui/button/Button';

import style from './friends-item.module.scss';

// *************************** FRIENDS ITEM COMPONENT *************************** //
const FriendsItem = ({ friend, declineOrUnfriend, getAllFriends }) => {
  // 'friend' passed as prop from Friends.js

  useEffect(() => {
    getAllFriends();
  }, [getAllFriends]);

  const onDeclineOrUnfriend = async (friendId) => {
    await declineOrUnfriend(friendId);
    await getAllFriends();
  };

  return (
    <div className={style.friendsItem}>
      <div className={style.friend}>
        <img src={friend.avatar} alt={friend.name} className={style.avatar} />
        <p className={style.name}>
          <Link to={`/profile/${friend.id}`} className={style.nameLink}>{friend.name}</Link>
        </p>
        <Button onClick={() => onDeclineOrUnfriend(friend.id)} danger medium>Unfriend</Button>
      </div>
    </div>
  )
};

// REDUX
const mapDispatchToProps = (dispatch) => ({
  declineOrUnfriend: (friendId) => dispatch(declineOrUnfriend(friendId)),
  getAllFriends: () => dispatch(getAllFriends()),
})

export default connect(null, mapDispatchToProps)(FriendsItem);