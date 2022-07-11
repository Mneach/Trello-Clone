
import './style/Home__css.css'
import NavbarContentPage from '../NavbarContentPage'
import LeftBarContentPage from '../LeftBarContentPage'
import GetWorkspaceData from '../workspace_page/GetWorkspaceData'
import RightBarContentPage from '../RightBarContentPage'
import GetFavoriteBoard from './GetFavoriteBoard'
import GetBoardDataHome from './GetBoardDataHome'
import GetHomeData from './GetHomeData'

const Home = () => {
  return(
    <div>
      <NavbarContentPage />
      <div className='homepage__content__container'>
      <LeftBarContentPage />
        <div className="homePage__content__mid__container">
        <GetHomeData />
       </div>
        <div className="homePage__content__right__container">
           <RightBarContentPage />
        </div>
      </div>
    </div>
  )
}

export default Home