import React from 'react'
import { Route, Routes } from 'react-router-dom'
import WorkspaceProvider from '../../../context/WorkspaceContext'
import BoardRoute from '../board_page/BoardRoute'
import FavoriteBoard from '../home_page/FavoriteBoard'
import WorksapceMember from './WorksapceMember'
import WorkspaceBoard from './WorkspaceBoard'
import WorkspaceSetting from './WorkspaceSetting'

const WorkspaceRoute = () => {
  return (
    <WorkspaceProvider>
      <Routes>
        <Route path='/' element={<WorkspaceBoard />} />
        <Route path='/Members' element={<WorksapceMember />} />
        <Route path='/Boards' element={<WorkspaceBoard />} />
        <Route path='/WorkspaceSetting' element={<WorkspaceSetting />}></Route>
        <Route path='/Board/:boardId/*' element={<BoardRoute />}></Route>
      </Routes>
    </WorkspaceProvider>
  )
}

export default WorkspaceRoute