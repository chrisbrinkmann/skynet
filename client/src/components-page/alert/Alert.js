import React, { } from 'react';
import { connect } from 'react-redux';

import style from './alert.module.scss';

// *************************** ALERT COMPONENT *************************** //
const Alert = ({ alerts }) => {
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
      <div 
        key={alert.id} 
        className={`
          ${style.alert}
          ${alert.alertType === 'success' ? style.success : ''}
          ${alert.alertType === 'danger' ? style.danger : ''}
          ${alert.alertType === 'warning' ? style.warning : ''}
        `}>
        { alert.msg }
      </div>
    ))
  )
};

// REDUX
const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);