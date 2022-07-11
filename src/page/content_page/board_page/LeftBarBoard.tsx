import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaRegCalendarAlt, FaUsers } from 'react-icons/fa'
import { FiSettings, FiStar } from 'react-icons/fi'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { GoStar } from 'react-icons/go'
import { Link, useParams } from 'react-router-dom'
import { useBoardContext } from '../../../context/BoardContext'
import { useUserContext } from '../../../context/UserContext'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { db } from '../../../firebase/config'
import './style/LeftBarBoard__css.css'

const LeftBarBoard = () => {

    const BoardContext = useBoardContext()
    const WorkspaceContext = useWorkspaceContext()
    const UserContext = useUserContext()
    const workspaceId = WorkspaceContext.workspace.workspaceId
    const { boardId } = useParams()
    const [checkFavoriteBoard , setCheckFavoriteBoard] = useState(UserContext.favoriteBoard.includes(boardId as string))

    
    const markBoardFavoriteHandle = async () => {
        await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/favoriteBoard`, boardId as string), {
            boardId: boardId,
            boardTitle: BoardContext.board.boardTitle,
            boardWorkspaceId: WorkspaceContext.workspace.workspaceId
        })
        
        UserContext.favoriteBoard.push(boardId as string)
        setCheckFavoriteBoard(true)
        console.log(UserContext.favoriteBoard)
    }

    console.log(checkFavoriteBoard)
    
    const unMarkBoardFavoriteHandle = async () => {
        await deleteDoc(doc(db , `UserCollection/${UserContext.user.userId}/favoriteBoard` , boardId as string))

        UserContext.favoriteBoard.push(boardId as string)
        let index = UserContext.favoriteBoard.indexOf(boardId as string)
        if(index > -1){
            UserContext.favoriteBoard.splice(index , 1)
        }
        
        setCheckFavoriteBoard(false)
        console.log(UserContext.favoriteBoard)       
    }

    return (
        <div className="board__content__left__container">
            <div className="board__content__left__title__container">
                <div className="board__content__left__title">
                    <p>{BoardContext.board.boardTitle}</p>
                </div>
            </div>
            <Link to={`/ContentPage/Workspace/${boardId}/Board/${boardId}/BoardContent`} className="board__ahref">
                <div className="board__content__left">
                    <div className="board__content__left__icon">
                        <MdOutlineSpaceDashboard />
                    </div>
                    <div className="board__content__left__word">
                        Board Content
                    </div>
                </div>
            </Link>
            <Link to={`/ContentPage/Workspace/${workspaceId}/Board/${boardId}/BoardMembers`} className="board__ahref" >
                <div className="board__content__left">
                    <div className="board__content__left__icon">
                        <FaUsers />
                    </div>
                    <div className="board__content__left__word">
                        Board Member
                    </div>
                </div>
            </Link>
            <Link to={`/ContentPage/Workspace/${workspaceId}/Board/${boardId}/BoardSetting`} className="board__ahref" >
                <div className="board__content__left">
                    <div className="board__content__left__icon">
                        <FiSettings />
                    </div>
                    <div className="board__content__left__word">
                        Setting Board
                    </div>
                </div>
            </Link>
            {
                checkFavoriteBoard === true ?
                (
                    <div className="board__content__left" onClick={unMarkBoardFavoriteHandle}>
                        <div className="board__content__left__icon">
                            <GoStar />
                        </div>
                        <div className="board__content__left__word">
                            Unmark Board As Favorite
                        </div>
                    </div>
                )
                :
                (
                    <div className="board__content__left" onClick={markBoardFavoriteHandle}>
                        <div className="board__content__left__icon">
                            <FiStar />
                        </div>
                        <div className="board__content__left__word">
                            Mark Board As Favorite
                        </div>
                    </div>
                )
            }
            <div className="board__content__left" >
                <div className="board__content__left__icon">
                    <AiOutlinePlus />
                </div>
                <div className="board__content__left__word">
                    Create List
                </div>
            </div>
        </div>
    )
}

export default LeftBarBoard