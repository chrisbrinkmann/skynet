import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getAllFriends, getAllRelations } from '../../redux/relations/relations.actions';

import style from './request-sent.module.scss'; 

// *************************** RELATIONS ITEM COMPONENT *************************** //
const RequestsSent = ({ relation, auth, users, getAllRelations }) => {
  // 'relation' passed down as prop from Friends.js
  const { first_user_id, second_user_id, relationType, createdAt } = relation;

  useEffect(() => {
    getAllRelations();
  }, [getAllRelations]);

  let requestee;
  if (auth.user.id === first_user_id && relationType === 'pending_first_second') {
    requestee = second_user_id;
  } else if (auth.user.id === second_user_id && relationType === 'pending_second_first') {
    requestee = first_user_id
  };

  return (
    <div className={style.requestsSent}>
      {
        requestee &&
          <div className={style.relations}>

            {/* RENDER REQUESTEE'S AVATAR */}
            {
              users.map(user => (
                user.id === requestee && <img key={user.name} src={user.avatar} alt={user.name} className={style.avatar}/>
              ))
            }

            {/* RENDER REQUESTEE'S NAME */}
            {
              users.map(user => (
                user.id === requestee && 
                  <p key={user.name} className={style.name}>
                    <Link to={`/profile/${user.id}`} className={style.nameLink}>{user.name}</Link>
                  </p>
              ))
            }

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
  getAllFriends: () => dispatch(getAllFriends()),
  getAllRelations: () => dispatch(getAllRelations()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsSent);