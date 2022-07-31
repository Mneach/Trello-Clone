
import '../../../css/homeStyle/Home__css.css'
import NavbarContentPage from '../NavbarContentPage'
import LeftBarContentPage from '../LeftBarContentPage'
import RightBarContentPage from '../RightBarContentPage'
import { MidContainer } from '../../../component/midContent/MidContainer'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { RightBarContainer } from '../../../component/rightBar/RightContainer'
import { collection, query, where } from 'firebase/firestore'
import { union, uniqBy } from 'lodash'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { MidContentCardContainer, MidContentContainer } from '../../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../../component/midContent/MidContent'
import { useUserContext } from '../../../context/UserContext'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { BoardHomeType, BoardType, cardType, WorkspaceType } from '../../../model/model'
import { FiSettings, FiActivity } from 'react-icons/fi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { GoSignOut } from 'react-icons/go'
import React, { MouseEventHandler, useState } from 'react'
import { auth, db } from '../../../lib/firebase/config'
import { Link, useNavigate } from 'react-router-dom'
import '../../../css/navbarStyle/NavbarContentPage__css.css'
import { AiOutlineUser } from 'react-icons/ai'


const Home = () => {

  const UserContext = useUserContext()
  const firestore = useFirestore()
  const WorkspaceContext = useWorkspaceContext()

  const navigate = useNavigate()
  //=== Get Workspace From Firestore ===

  const [search, setSearch] = useState("")

  const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf/`)
  const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
    idField: 'workspaceId'
  })

  const getBoardCollection = collection(firestore, "BoardCollection")
  const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
  const { status: statusBoard, data: boards } = useFirestoreCollectionData(
    query(getBoardByUserId, where("boardStatus", "==", "Open")), {
    idField: 'boardId'
  })

  const { status: statusBoardPublic, data: boardPublicData } = useFirestoreCollectionData(
    query(getBoardCollection,
      where("boardVisibility", "==", "Public"),
      where("boardStatus", "==", "Open")
    ), {
    idField: 'boardId'
  }
  )

  const getCardQuery = collection(firestore, 'CardCollection')
  const { status: statusCardData, data: dataCard } = useFirestoreCollectionData(
    query(getCardQuery), {
    idField: 'cardId'
  })

  const getPublicWorkspace = collection(firestore, 'WorkspaceCollection')
  const { status: statusWorkspacePublic, data: publicWorkspace } = useFirestoreCollectionData(
    query(getPublicWorkspace, where("workspaceVisibility", "==", "Public")), {
    idField: 'workspaceId'
  })

  if (statusCardData === 'loading' || statusBoardPublic === 'loading' || statusBoard === 'loading' || statusWorkspace === 'loading' || statusWorkspacePublic === 'loading') {
    return (<div>GETTING WORKSPACE DATA</div>)
  }

  const userWorkspaceData = workspaceses as Array<WorkspaceType>
  const publicWorkspaceData = publicWorkspace as Array<WorkspaceType>

  const cardData = dataCard as Array<cardType>

  const workspaceData: Array<WorkspaceType> = uniqBy(union((userWorkspaceData), (publicWorkspaceData)), 'workspaceId')
  const boardData = uniqBy(union((boards as Array<BoardHomeType>), (boardPublicData as Array<BoardHomeType>)), 'boardId')

  const realCardData = cardData.filter((cardData) => {
    for (let i = 0; i < boardData.length; i++) {
      const element = boardData[i];
      if (element.boardId === cardData.boardId) return cardData
    }
  })

  const workspaceDataFilterSearch = workspaceData.filter((workspaceData) => {
    if (search === '') {
      return workspaceData
    } else {
      return workspaceData.workspaceTitle.includes(search)
    }
  })


  const boardDataFilterSearch = boardData.filter((boardData) => {
    if (search === '') {
      return boardData
    } else {
      return boardData.boardTitle.includes(search)
    }
  })

  const cardDataFilterSearch = realCardData.filter((cardData) => {
    if (search === '') {
      return cardData
    } else {
      return cardData.cardName.includes(search)
    }
  })

  const signOut: MouseEventHandler<HTMLButtonElement> = async (e) => {
    await auth.signOut()
    navigate('/')
  }

  
  const handleKeyDown = (e : any) => {
    console.log(e.ctrlKey)
    console.log(e.key)
    if(e.ctrlKey === true && e.key === "1"){
      navigate("../")
    }else if (e.ctrlKey === true && e.key === "2") {
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
      <div className='homePage__navbar__container'>
        <div className="homePage__navbar__left">
          <Link to={'/ContentPage/'} className="chello_ahref">
            Chello
          </Link>
        </div>
        <div className="homePage__navbar__mid">
          <input className='homePage__search' placeholder='Search' type="text" onChange={(e) => setSearch(e.target.value)} />
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
            Array.isArray(boardDataFilterSearch) && !boardDataFilterSearch.length && Array.isArray(workspaceDataFilterSearch) && !workspaceDataFilterSearch.length ?
              (
                <MidContentContainer>
                  <MidContentTitle titleName={" THERE IS NO DATA "} data={false}></MidContentTitle>
                </MidContentContainer>
              )
              :
              (
                <>
                  {
                    Array.isArray(workspaceDataFilterSearch) && !workspaceDataFilterSearch.length ? null :
                      (
                        <MidContentContainer>
                          <MidContentTitle titleName={"WORKSPACE DATA"} data={true}></MidContentTitle>
                          <MidContentCardContainer>
                            {workspaceDataFilterSearch.map((workspace) => (
                              <MidContentCard type="Workspace" content={workspace.workspaceTitle} linkTo={`/ContentPage/Workspace/${workspace.workspaceId}/Boards`} ></MidContentCard>
                            ))}
                          </MidContentCardContainer>
                        </MidContentContainer>
                      )
                  } {
                    Array.isArray(boardDataFilterSearch) && !boardDataFilterSearch.length ? null :
                      (
                        <MidContentContainer>
                          <MidContentTitle titleName={"BOARD DATA"} data={true}></MidContentTitle>
                          <MidContentCardContainer>
                            {boardDataFilterSearch.map((board) => (
                              <MidContentCard type={"Board"} content={board.boardTitle} linkTo={`/ContentPage/Workspace/${board.boardWorkspaceId}/Board/${board.boardId}`} ></MidContentCard>
                            ))}
                          </MidContentCardContainer>
                        </MidContentContainer>
                      )
                  }  {
                    Array.isArray(cardDataFilterSearch) && !cardDataFilterSearch.length ? null :
                      (
                        <MidContentContainer>
                          <MidContentTitle titleName={"Card Data"} data={true}></MidContentTitle>
                          <MidContentCardContainer>
                            {cardDataFilterSearch.map((card) => (
                              <MidContentCard type={"Card"} content={card.cardName} linkTo={`/ContentPage/Workspace/${card.workspaceId}/Board/${card.boardId}`} ></MidContentCard>
                            ))}
                          </MidContentCardContainer>
                        </MidContentContainer>
                      )
                  }
                </>
              )
          }
        </MidContainer>
        <RightBarContainer>
          <RightBarContentPage />
        </RightBarContainer>
      </GeneralContentContainer>
    </div>
  )
}

export default Home