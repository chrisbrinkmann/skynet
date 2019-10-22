import React from 'react'
import PageContainer from '../../components-page/page-container/PageContainer'
import style from './notfound-page.module.scss'

// *************************** NOT FOUND PAGE *************************** //
const NotFoundPage = () => {
  return (
    <PageContainer notfound>
      <div className={style.subContainer}>
        <img
          src={process.env.PUBLIC_URL + '/assets/skull.png'}
          className={style.skull}
        />
        <div>
          <h1 className={style.title}>404</h1>
          <span className={style.break}>|</span>
          <h2 className={style.subtitle}>This page could not be found.</h2>
        </div>
      </div>
    </PageContainer>
  )
}

export default NotFoundPage
