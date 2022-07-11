import React from 'react'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'
import GetWorkspaceData from '../workspace_page/GetWorkspaceData'
import GetBoardDataHome from './GetBoardDataHome'
import GetFavoriteBoard from './GetFavoriteBoard'
import './style/Home__css.css'

const HomeBoard = () => {
  return (
     <div>
      <NavbarContentPage />
      <div className='homepage__content__container'>
      <LeftBarContentPage />
        <div className="homePage__content__mid__container">
           <GetBoardDataHome />
       </div>
        <div className="homePage__content__right__container">
           <RightBarContentPage />
        </div>
      </div>
    </div>
  )
}

export default HomeBoard