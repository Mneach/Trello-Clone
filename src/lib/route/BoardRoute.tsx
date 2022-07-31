import React from 'react'
import { Route, Routes } from 'react-router-dom'
import BoardProvider from '../../context/BoardContext'
import BoardContent from '../../page/content_page/board_page/BoardContent'
import BoardMember from '../../page/content_page/board_page/BoardMember'
import BoardSetting from '../../page/content_page/board_page/BoardSetting'

const BoardRoute = () => {
  return (
    <BoardProvider>
          <Routes>
            <Route path='/' element = {<BoardContent />} />
            <Route path='/BoardContent' element = {<BoardContent />} />
            <Route path='/BoardMembers' element = {<BoardMember />} />
            <Route path='/BoardSetting' element={<BoardSetting />}></Route>
        </Routes>
    </BoardProvider>
  )
}

export default BoardRoute