import React, { } from 'react';

import style from './page-container.module.scss';

// *************************** PAGE CONTAINER COMPONENT *************************** //
const PageContainer = ({ notfound, children }) => {
  // destructured props passed down via parent component (page types and children)
  return (
    <div 
      className={`
        ${notfound ? style.notfound : ''}
        ${style.container}
      `}
    >
      {children}
    </div>
  )
};

export default PageContainer;