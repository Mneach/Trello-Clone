
import LeftBarWorkspace from './LeftBarWorkspace'
import '../../../css/homeStyle/Home__css.css'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { useUserContext } from '../../../context/UserContext'
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { BoardType } from '../../../model/model'
import { union, uniqBy } from 'lodash'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import '../../../css/boardStyle/Board__css.css'
import { MidContainer, MidContentCardContainer, MidContentContainer } from '../../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../../component/midContent/MidContent'
import { FiSettings, FiActivity } from 'react-icons/fi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { GoSignOut } from 'react-icons/go'
import React, { MouseEventHandler, useState } from 'react'
import { auth, db } from '../../../lib/firebase/config'
import '../../../css/navbarStyle/NavbarContentPage__css.css'
import { AiOutlineUser } from 'react-icons/ai'
import { Button, Form, Modal } from 'react-bootstrap'



const WorkspaceBoard = () => {
  const UserContext = useUserContext()
  const WorkspaceContext = useWorkspaceContext()
  const firestore = useFirestore()
  const navigate = useNavigate()
  //=== Get Board From Firestore ===

  const getBoardCollection = collection(firestore, "BoardCollection")
  const [search, setSearch] = useState("")

  // const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
  // const { status: statusBoard, data: boards } = useFirestoreCollectionData(
  //     query(getBoardByUserId), {
  //     idField: 'boardId'
  // })

  const { status: statusBoardPublic, data: boardPublicData } = useFirestoreCollectionData(
    query(getBoardCollection,
      where("boardVisibility", "==", "Public"),
      where("boardWorkspaceId", "==", WorkspaceContext.workspace.workspaceId),
      where("boardStatus", "==", "Open")
    ), {
    idField: 'boardId'
  }
  )

  const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
  const { status: statusBoard, data: boards } = useFirestoreCollectionData(
    query(getBoardByUserId, where("boardStatus", "==", "Open"), where("boardWorkspaceId", "==", WorkspaceContext.workspace.workspaceId)), {
    idField: 'boardId'
  })

  if (statusBoard === 'loading' || statusBoardPublic === 'loading') {
    return (<div>Getting Board Data....</div>)
  }

  let boardData: Array<BoardType>

  if (WorkspaceContext.currentUserWorkspaceRole === 'Guest') {
    boardData = boardPublicData as Array<BoardType>
  } else {
    boardData = uniqBy(union((boards as Array<BoardType>), (boardPublicData as Array<BoardType>)), 'boardId')
  }

  const signOut: MouseEventHandler<HTMLButtonElement> = async (e) => {
    await auth.signOut()
    navigate('/')
  }


  const boardDataFilterSearch = boardData.filter((boardData) => {
    if (search === '') {
      return boardData
    } else {
      return boardData.boardTitle.includes(search)
    }
  })


  return (
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
          <LeftBarWorkspace />
        </LeftBarContainer>
        <MidContainer isDetailPage={true}>
          {
            Array.isArray(boardDataFilterSearch) && !boardDataFilterSearch.length ?
              (
                <MidContentContainer>
                  <MidContentTitle titleName={"THERE IS NO BOARD"} data={false}></MidContentTitle>
                </MidContentContainer>
              )
              :
              (
                <MidContentContainer>
                  <MidContentTitle titleName={"BOARD DATA"} data={true}></MidContentTitle>
                  <MidContentCardContainer>
                    {boardDataFilterSearch.map((board) => (
                      <MidContentCard type={"Board"} content={board.boardTitle} linkTo={`/ContentPage/Workspace/${WorkspaceContext.workspace.workspaceId}/Board/${board.boardId}`} ></MidContentCard>
                    ))}
                  </MidContentCardContainer>
                </MidContentContainer>
              )
          }

        </MidContainer>
      </GeneralContentContainer>
    </div>
  )
}

export default WorkspaceBoard 