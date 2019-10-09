import React, { } from 'react';
import PageContainer from '../../components-page/page-container/PageContainer';
import style from './notfound-page.module.scss';

// *************************** NOT FOUND PAGE *************************** //
const NotFoundPage = () => {
  return (
    <PageContainer notfound>
      <h1 className={style.title}>404</h1>
      <span className={style.break}>|</span>
      <h2 className={style.subtitle}>This page could not be found.</h2>
    </PageContainer>
  )
};

export default NotFoundPage;