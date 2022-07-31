import React from 'react'
import { Route, Routes } from 'react-router-dom'
import WorkspaceProvider from '../../context/WorkspaceContext'
import BoardRoute from './BoardRoute'
import FavoriteBoard from '../../page/content_page/home_page/FavoriteBoard'
import WorksapceMember from '../../page/content_page/workspace_page/WorksapceMember'
import WorkspaceBoard from '../../page/content_page/workspace_page/WorkspaceBoard'
import WorkspaceSetting from '../../page/content_page/workspace_page/WorkspaceSetting'
import WorkspaceLandingPage from '../../page/content_page/workspace_page/WorkspaceLandingPage'

const WorkspaceRoute = () => {
  return (
    <WorkspaceProvider>
      <Routes>
        <Route path='/' element={<WorkspaceLandingPage />} />
        <Route path='/Members' element={<WorksapceMember />} />
        <Route path='/Boards' element={<WorkspaceBoard />} />
        <Route path='/WorkspaceSetting' element={<WorkspaceSetting />}></Route>
        <Route path='/Board/:boardId/*' element={<BoardRoute />}></Route>
        
      </Routes>
    </WorkspaceProvider>
  )
}

export default WorkspaceRoute