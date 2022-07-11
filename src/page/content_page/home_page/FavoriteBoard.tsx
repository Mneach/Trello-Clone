import React from 'react'
import GetBoardData from '../board_page/GetBoardData'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'
import GetFavoriteBoard from './GetFavoriteBoard'

const FavoriteBoard = () => {
  return (
    <div>
      <NavbarContentPage />
      <div className='homepage__content__container'>
      <LeftBarContentPage />
        <div className="homePage__content__mid__container">
           <GetFavoriteBoard /> 
       </div>
        <div className="homePage__content__right__container">
           <RightBarContentPage />
        </div>
      </div>
    </div>
  )
}

export default FavoriteBoard