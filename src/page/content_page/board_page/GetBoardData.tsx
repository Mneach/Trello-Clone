import React, { MouseEventHandler, useState } from 'react'
import { useUserContext } from '../../../context/UserContext'
import { addDoc, collection, doc, query, setDoc, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollection, useFirestoreCollectionData } from 'reactfire'
import { BoardType, WorkspaceType } from '../../../model/model'
import { union, uniq, uniqBy } from 'lodash'
import { Link } from 'react-router-dom'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { FiStar } from 'react-icons/fi'
import './style/Board__css.css'

const GetBoardData = () => {

    const UserContext = useUserContext()
    const WorkspaceContext = useWorkspaceContext()
    const firestore = useFirestore()

    //=== Get Board From Firestore ===

    const getBoardCollection = collection(firestore, "BoardCollection")

    const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
    const { status: statusBoard, data: boards } = useFirestoreCollectionData(
        query(getBoardByUserId), {
        idField: 'boardId'
    })

    const { status: statusBoardPublic, data: boardPublicData } = useFirestoreCollectionData(
        query(getBoardCollection,
            where("boardVisibility", "==", "Public"),
            where("boardWorkspaceId", "==", WorkspaceContext.workspace.workspaceId)
        ), {
        idField: 'boardId'
    }
    )

    if (statusBoard === 'loading' || statusBoardPublic === 'loading') {
        return (<div>Getting Board Data....</div>)
    }

    let boardData: Array<BoardType>

    if (WorkspaceContext.currentUserWorkspaceRole === 'Guest') {
        boardData = boardPublicData as Array<BoardType>
    } else {
        boardData = uniqBy(union((boards as Array<BoardType>), (boardPublicData as Array<BoardType>)), 'boardId')
    }

    const favoriteBoardHandle = () => {
        console.log("test")
    }

    console.log(boardData)
    //=== End Of Get Workspace From Firestore ===  

    if (Array.isArray(boardData) && !boardData.length) {
        return (
            <div className="workspace__content__mid">
                <div className="workspace__title">
                    THERE IS NO BOARD
                </div>
            </div>

        )
    } else {
        return (
            <div className="workspace__content__mid">
                <div className="workspace__title">
                    BOARD DATA
                </div>
                <div className="workspace__content">
                    {boardData.map((board) => (
                        <Link to={`/ContentPage/Workspace/${WorkspaceContext.workspace.workspaceId}/Board/${board.boardId}`} className="link__workspace">
                            <div className="workspace__workspaceCard">
                                <div className="workspace__workspaceCard__title">
                                </div>
                                <div className="workspace__workspaceCard__content">
                                    <p>{board.boardTitle} </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }
}

export default GetBoardData 