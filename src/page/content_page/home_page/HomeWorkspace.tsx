import React from 'react'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'
import GetWorkspaceData from '../../../lib/getData/GetWorkspaceData'
import { MidContainer } from '../../../component/midContent/MidContainer'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { RightBarContainer } from '../../../component/rightBar/RightContainer'
import { useUserContext } from '../../../context/UserContext'
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { WorkspaceType } from '../../../model/model'
import { union, uniqBy } from 'lodash'
import { Link, useNavigate } from 'react-router-dom'
import { MidContentCardContainer, MidContentContainer } from '../../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../../component/midContent/MidContent'
import { FiSettings, FiActivity } from 'react-icons/fi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { GoSignOut } from 'react-icons/go'
import { MouseEventHandler, useState } from 'react'
import { auth, db } from '../../../lib/firebase/config'
import '../../../css/navbarStyle/NavbarContentPage__css.css'
import { AiOutlineUser } from 'react-icons/ai'

const WorkspacePage = () => {


  const UserContext = useUserContext()
  const firestore = useFirestore()
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  //=== Get Workspace From Firestore ===

  const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf/`)
  const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
    idField: 'workspaceId'
  })

  const getPublicWorkspace = collection(firestore, 'WorkspaceCollection')
  const { status: statusWorkspacePublic, data: publicWorkspace } = useFirestoreCollectionData(
    query(getPublicWorkspace, where("workspaceVisibility", "==", "Public")), {
    idField: 'workspaceId'
  })

  if (statusWorkspace === 'loading' || statusWorkspacePublic === 'loading') {
    return (<div>GETTING WORKSPACE DATA</div>)
  }

  const userWorkspaceData = workspaceses as Array<WorkspaceType>
  const publicWorkspaceData = publicWorkspace as Array<WorkspaceType>
  const workspaceData: Array<WorkspaceType> = uniqBy(union((userWorkspaceData), (publicWorkspaceData)), 'workspaceId')
  //=== End Of Get Workspace From Firestore ===  


  const signOut: MouseEventHandler<HTMLButtonElement> = async (e) => {
    await auth.signOut()
    navigate('/')
  }

  const workspaceDataFilterSearch = workspaceData.filter((workspaceData) => {
    if (search === '') {
      return workspaceData
    } else {
      return workspaceData.workspaceTitle.includes(search)
    }
  })

  
  const handleKeyDown = (e: any) => {
    console.log(e.ctrlKey)
    console.log(e.key)
    if (e.ctrlKey === true && e.key === "1") {
      navigate("../")
    } else if (e.ctrlKey === true && e.key === "2") {
      navigate("../FavoriteBoards")
    } else if (e.ctrlKey === true && e.key === "3") {
      navigate("../Workspace")
    } else if (e.ctrlKey === true && e.key === "4") {
      navigate("../Boards")
    } else if (e.ctrlKey === true && e.key === "5") {
      navigate("../ClosedBoard")
    }
  }

  return (
    <div onKeyDown={handleKeyDown} tabIndex={100 as number}>
      <div>
        <div className='homePage__navbar__container'>
          <div className="homePage__navbar__left">
            <Link to={'/ContentPage/'} className="chello_ahref">
              Chello
            </Link>
          </div>
          <div className="homePage__navbar__mid">
            <input className='homePage__search' onChange={(e) => setSearch(e.target.value)} placeholder='Search' type="text" />
          </div>
          <div className="homePage__navbar__right">
            <div className="user__activity__icon">
              <button className="button__icon">
                <FiActivity />
              </button>
            </div>
            <div className="user__notification__icon">
              <button className="button__icon">
                <IoNotificationsOutline />
              </button>
            </div>
            <div className="user__setting__icon">
              <Link to={'/ContentPage/UserProfile'} >
                <button className="button__icon">
                  <AiOutlineUser />
                </button>
              </Link>
            </div>
            <div className="user__signOut__icon">
              <button className='button__icon' onClick={signOut}>
                <GoSignOut />
              </button>
            </div>
          </div>
        </div>
        <GeneralContentContainer>
          <LeftBarContainer>
            <LeftBarContentPage />
          </LeftBarContainer>
          <MidContainer isDetailPage={false}>
            {
              Array.isArray(workspaceDataFilterSearch) && !workspaceDataFilterSearch.length ?
                (
                  <MidContentContainer>
                    <MidContentTitle titleName={" THERE IS NO WORKSPACE"} data={false}></MidContentTitle>
                  </MidContentContainer>
                )
                :
                (
                  <MidContentContainer>
                    <MidContentTitle titleName={" Workspace Data "} data={true}></MidContentTitle>
                    <MidContentCardContainer>
                      {workspaceDataFilterSearch.map((workspace) => (
                        <MidContentCard type="Workspace" content={workspace.workspaceTitle} linkTo={`/ContentPage/Workspace/${workspace.workspaceId}/Boards`} ></MidContentCard>
                      ))}
                    </MidContentCardContainer>
                  </MidContentContainer>
                )
            }
          </MidContainer>
          <RightBarContainer>
            <RightBarContentPage />
          </RightBarContainer>
        </GeneralContentContainer>
      </div>
    </div>
  )
}

export default WorkspacePage