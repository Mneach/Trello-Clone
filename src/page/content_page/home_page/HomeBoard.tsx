import React from 'react'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'
import GetBoardDataHome from '../../../lib/getData/GetBoardDataHome'
import '../../../css/homeStyle/Home__css.css'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { RightBarContainer } from '../../../component/rightBar/RightContainer'
import { useUserContext } from '../../../context/UserContext'
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { BoardHomeType, BoardType } from '../../../model/model'
import { union, uniqBy } from 'lodash'
import { MidContainer, MidContentCardContainer, MidContentContainer } from '../../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../../component/midContent/MidContent'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { FiSettings, FiActivity } from 'react-icons/fi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { GoSignOut } from 'react-icons/go'
import { MouseEventHandler, useState } from 'react'
import { auth, db } from '../../../lib/firebase/config'
import { Link, useNavigate } from 'react-router-dom'
import '../../../css/navbarStyle/NavbarContentPage__css.css'
import { AiOutlineUser } from 'react-icons/ai'

const HomeBoard = () => {
  const UserContext = useUserContext()
  const firestore = useFirestore()
  const WorkspaceContext = useWorkspaceContext()

  //=== Get Board From Firestore ===

  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const getBoardCollection = collection(firestore, "BoardCollection")

  const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
  const { status: statusBoard, data: boards } = useFirestoreCollectionData(
    query(getBoardByUserId, where("boardStatus", "==", "Open")), {
    idField: 'boardId'
  })

  const { status: statusBoardPublic, data: boardPublicData } = useFirestoreCollectionData(
    query(getBoardCollection,
      where("boardVisibility", "==", "Public"),
      where("boardStatus", "==", "Open"),
    ), {
    idField: 'boardId'
  }
  )

  if (statusBoard === 'loading' || statusBoardPublic === 'loading') {
    return (<div>Getting Board Data....</div>)
  }

  console.log(boards)
  console.log(boardPublicData)

  let boardData: Array<BoardHomeType> = []

  boardData = uniqBy(union((boards as Array<BoardHomeType>), (boardPublicData as Array<BoardHomeType>)), 'boardId')

  console.log(boardData)

  const boardDataFilterSearch = boardData.filter((boardData) => {
    if (search === '') {
      return boardData
    } else {
      return boardData.boardTitle.includes(search)
    }
  })

  const signOut: MouseEventHandler<HTMLButtonElement> = async (e) => {
    await auth.signOut()
    navigate('/')
  }

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
            Array.isArray(boardDataFilterSearch) && !boardDataFilterSearch.length ?
              (
                <MidContentContainer>
                  <MidContentTitle titleName={" THERE IS NO BOARD DATA "} data={false}></MidContentTitle>
                </MidContentContainer>
              )
              :
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
          }
        </MidContainer>
        <RightBarContainer>
          <RightBarContentPage />
        </RightBarContainer>
      </GeneralContentContainer>
    </div>
  )
}

export default HomeBoard