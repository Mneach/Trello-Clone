import { getAuth } from 'firebase/auth'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider, useFirebaseApp } from 'reactfire'
import { UserProvider } from '../../context/UserContext'
import FavoriteBoard from './home_page/FavoriteBoard'
import Home from './home_page/Home'
import HomeBoard from './home_page/HomeBoard'
import UserPage from './user_page/UserPage'
import WorkspaceBoard from './workspace_page/WorkspaceBoard'
import WorkspacePage from './workspace_page/WorkspacePage'
import WorkspaceRoute from './workspace_page/WorkspaceRoute'

const ContentPage = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path='/UserProfile' element={<UserPage />} />
        <Route path='/Workspace' element={<WorkspacePage />} />
        <Route path='/Boards' element = {<HomeBoard />} ></Route>
        <Route path='/FavoriteBoards' element={<FavoriteBoard />} />
        <Route path='/Workspace/:workspaceId/*' element={<WorkspaceRoute />}></Route>
        <Route path='/' element={<Home />} />
      </Routes>
    </UserProvider>
  )
}

export default ContentPage 