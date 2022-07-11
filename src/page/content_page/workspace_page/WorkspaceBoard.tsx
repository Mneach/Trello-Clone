
import NavbarContentPage from '../NavbarContentPage'
import LeftBarWorkspace from './LeftBarWorkspace'
import '../home_page/style/Home__css.css'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import GetBoardData from '../board_page/GetBoardData'

const WorkspaceBoard = () => {

  return (
    <div>
        <NavbarContentPage />  
      <div className='homepage__content__container'>
        <LeftBarWorkspace />
        <div className="homePage__content__mid__container">
          <GetBoardData />
       </div>
      </div>

    </div>
  )
}

export default WorkspaceBoard 