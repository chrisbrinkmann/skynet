import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getAllUsers, getAllRelations, getAllFriends } from '../../redux/relations/relations.actions';

import RequestsPending from '../requests-pending/RequestsPending';
import RequestsSent from '../requests-sent/RequestsSent';
import FriendsItem from '../friends-item/FriendsItem';

import style from './friends.module.scss';

// *************************** FRIENDS COMPONENT (FRIENDS LIST) *************************** //
const Friends = ({ friendsList, allRelations, auth, getAllUsers, getAllRelations, getAllFriends }) => {
  useEffect(() => {
    getAllUsers();
    getAllRelations();
    getAllFriends();
  }, [getAllUsers, getAllFriends, getAllRelations]);

  return (
    <div className={style.friends}>

      <h2 className={style.title}>Pending Friend Requests</h2>
      <div className={style.relationsContainer}>
      {
        allRelations.length > 0
          ? allRelations.map(relation => (
            ((auth.user.id === relation.second_user_id && relation.relationType === 'pending_first_second') || (auth.user.id === relation.first_user_id && relation.relationType === 'pending_second_first'))
            && <RequestsPending key={relation.createdAt} relation={relation} />
          ))
          : <p>No pending friend requests...</p>
      }
      </div>

      <h2 className={style.title}>Sent Friend Requests</h2>
      <div className={style.relationsContainer}>
        {
          allRelations.length > 0
            ? allRelations.map(relation => (
              ((auth.user.id === relation.first_user_id && relation.relationType === 'pending_first_second') || (auth.user.id === relation.second_user_id && relation.relationType === 'pending_second_first'))
              && <RequestsSent key={relation.createdAt} relation={relation} />
            ))
            : <p>No friend requests sent...</p>
        }
      </div>

      <h2 className={style.title}>Friends List</h2>
      <div className={style.friendsContainer}>
        {
          (friendsList && friendsList.length > 0)
            ? friendsList.map(friend => (
              <FriendsItem key={friend.id} friend={friend} />
            ))
            : <p>No current friends...search for users!</p>
        }
      </div>

    </div>
  );
};

// REDUX
const mapStateToProps = (state) => ({
  friendsList: state.relations.friendsList,
  allRelations: state.relations.allRelations,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  getAllUsers: () => dispatch(getAllUsers()),
  getAllRelations: () => dispatch(getAllRelations()),
  getAllFriends: () => dispatch(getAllFriends()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Friends);