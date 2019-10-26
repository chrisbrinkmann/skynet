import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getAllFriends, getAllRelations, acceptRequest, declineOrUnfriend } from '../../redux/relations/relations.actions';

import Button from '../../components-ui/button/Button';

import style from './requests-pending.module.scss';

// *************************** RELATIONS ITEM COMPONENT *************************** //
const RequestsPending = ({ relation, auth, users, acceptRequest, declineOrUnfriend, getAllFriends, getAllRelations }) => {
  // 'relation' passed down as prop from Friends.js
  const { first_user_id, second_user_id, relationType } = relation;

  useEffect(() => {
    getAllRelations();
  }, [getAllRelations])

  const onAcceptRequest = async (friendId) => {
    await acceptRequest(friendId);
    await getAllFriends();
    await getAllRelations();
  };

  const onDeclineOrUnfriend = async (friendId) => {
    await declineOrUnfriend(friendId);
    await getAllFriends();
    await getAllRelations();
  };

  let requestor;
  if (auth.user.id === second_user_id && relationType === 'pending_first_second') {
    requestor = first_user_id;
  } else if (auth.user.id === first_user_id && relationType === 'pending_second_first') {
    requestor = second_user_id
  };

  return (
    <div className={style.requestsPending}>
      {
        requestor &&
          <div className={style.relations}>

            {/* RENDER REQUESTOR'S AVATAR */}
            {
              users.map(user => (
                user.id === requestor && 
                  <img key={user.name} src={user.avatar} alt={user.name} className={style.avatar} />
              ))
            }

            {/* RENDER REQUESTOR'S NAME */}
            {
              users.map(user => (
                user.id === requestor && 
                  <p key={user.name} className={style.name}>
                    <Link to={`/profile/${user.id}`} className={style.nameLink}>{user.name}</Link>
                  </p>
              ))
            }

            <div className={style.buttons}>
              <Button onClick={() => onAcceptRequest(requestor)} warning medium>Accept Request</Button>
              <Button onClick={() => onDeclineOrUnfriend(requestor)} warning medium>Decline Request</Button>
            </div>

          </div>
      }
    </div>
  )
};

// REDUX
const mapStateToProps = (state) => ({
  auth: state.auth,
  users: state.relations.users,
});

const mapDispatchToProps = (dispatch) => ({
  acceptRequest: (friendId) => dispatch(acceptRequest(friendId)),
  declineOrUnfriend: (friendId) => dispatch(declineOrUnfriend(friendId)),
  getAllFriends: () => dispatch(getAllFriends()),
  getAllRelations: () => dispatch(getAllRelations()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsPending);