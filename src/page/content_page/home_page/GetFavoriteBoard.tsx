import { collection, query, where } from 'firebase/firestore'
import React from 'react'
import { Link } from 'react-router-dom'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { useUserContext } from '../../../context/UserContext'
import { BoardType } from '../../../model/model'

const GetFavoriteBoard = () => {
    const UserContext = useUserContext()
    const firestore = useFirestore()

    //=== Get Workspace From Firestore ===

    const getBoardQuery = collection(firestore, `UserCollection/${UserContext.user.userId}/favoriteBoard/`)
    const { status: statusWorkspace, data: boardData } = useFirestoreCollectionData(query(getBoardQuery), {
        idField: 'uid'
    })

    if (statusWorkspace === 'loading') {
        return (<div>GETTING BOARD DATA</div>)
    }

    const boards = boardData as Array<BoardType>


    //=== End Of Get Workspace From Firestore ===  

    if (Array.isArray(boards) && !boards.length) {
        return (
            <div className="homePage__content__mid">
                <div className="homePage__title">
                    THERE IS NO FAVORITE BOARD
                </div>
            </div>

        )
    } else {
        return (
            <div className="homePage__content__mid">
                <div className="homePage__title">
                    FAVORITE BOARD DATA
                </div>
                <div className="homePage__content">
                    {boards.map((board) => (
                        <Link to={`/ContentPage/Workspace/${board.boardId}/Boards/${board.boardId}`} className="link__workspace">
                            <div className="homePage__boardCard">
                                <div className="homePage__boardCard__title">
                                    {/* {workspace.workspaceTitle} */}
                                </div>
                                <div className="homePage__boardCard__content">
                                    <p>{board.boardTitle}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }
}


export default GetFavoriteBoard