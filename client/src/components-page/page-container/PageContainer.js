import React, { } from 'react';

import style from './page-container.module.scss';

// *************************** PAGE CONTAINER COMPONENT *************************** //
const PageContainer = ({ landing, notfound, children }) => {
  // destructured props passed down via parent component (page types and children)
  return (
    <div 
      className={`
        ${landing ? style.landing : ''}
        ${notfound ? style.notfound : ''}
        ${style.container}
      `}
    >
      {children}
    </div>
  )
};

export default PageContainer;