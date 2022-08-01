import { Route, Routes } from 'react-router-dom'
import { UserProvider } from '../../context/UserContext'
import FavoriteBoard from '../../page/content_page/home_page/FavoriteBoard'
import Home from '../../page/content_page/home_page/Home'
import HomeBoard from '../../page/content_page/home_page/HomeBoard'
import UserPage from '../../page/content_page/user_page/UserPage'
import WorkspacePage from '../../page/content_page/home_page/HomeWorkspace'
import WorkspaceRoute from './WorkspaceRoute'
import WorkspaceInvitationLink from '../../page/content_page/workspace_page/WorkspaceInvitationLink'
import WorkspaceInvitationLinkEmail from '../../page/content_page/workspace_page/WorkspaceInvitationEmail'
import WorkspaceInvitationError from '../../page/content_page/workspace_page/WorkspaceInvitationError'
import HomeCloseBoard from '../../page/content_page/home_page/HomeCloseBoard'
import HomeCloseBoardDetail from '../../page/content_page/home_page/HomeCloseBoardDetail'
import BoardInvitationLink from '../../page/content_page/board_page/BoardInvitationLink'
import BoardInvitationLinkEmail from '../../page/content_page/board_page/BoardInvitationEmail'
import BoardInvitationError from '../../page/content_page/board_page/BoardInvitationError'
import BoardViewCardLink from '../../page/content_page/board_page/BoardViewCardLink'
import UserNotification from '../../page/content_page/user_page/UserNotification'

const ContentPage = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path='/UserProfile' element={<UserPage />} />
        <Route path='/UserNotification' element={<UserNotification />} />
        <Route path='/Workspace' element={<WorkspacePage />} />
        <Route path='/Boards' element = {<HomeBoard />} ></Route>
        <Route path='/ClosedBoard' element = {<HomeCloseBoard />} ></Route>
        <Route path='/ClosedBoard/:boardId' element = {<HomeCloseBoardDetail />} ></Route>
        <Route path='/FavoriteBoards' element={<FavoriteBoard />} />
        <Route path='/WorkspaceInviteLink/:linkInvitation' element={<WorkspaceInvitationLink />} />
        <Route path='/WorkspaceInviteEmail/:linkInvitation' element={<WorkspaceInvitationLinkEmail />} />
        <Route path='/WorkspaceInviteError/:linkInvitation'  element={<WorkspaceInvitationError />} />
        <Route path='/Workspace/:workspaceId/*' element={<WorkspaceRoute />}></Route>
        <Route path='/BoardInviteLink/:linkInvitation' element={<BoardInvitationLink />} />
        <Route path='/BoardInviteEmail/:linkInvitation' element={<BoardInvitationLinkEmail />} />
        <Route path='/BoardInviteError/:linkInvitation'  element={<BoardInvitationError />} />
        <Route path='/BoardViewCardLInk/:linkInvitation'  element={<BoardViewCardLink />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </UserProvider>
  )
}

export default ContentPage 