import React from 'react'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'
import GetWorkspaceData from './GetWorkspaceData'


const WorkspacePage = () => {
  return (
    <div>
      <NavbarContentPage />
      <div className='homepage__content__container'>
        <LeftBarContentPage />
        <div className="homePage__content__mid__container">
          <GetWorkspaceData />
        </div>
        <div className="homePage__content__right__container">
          <RightBarContentPage />
        </div>
      </div>
    </div>
  )
}

export default WorkspacePage