import { collection, query, where } from 'firebase/firestore'
import { union, uniqBy } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { useUserContext } from '../../../context/UserContext'
import { BoardType, WorkspaceType } from '../../../model/model'


const GetHomeData = () => {
    const UserContext = useUserContext()
    const firestore = useFirestore()

    //=== Get Workspace From Firestore ===

    const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf/`)
    const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
        idField: 'uid'
    })

    const getBoardCollection = collection(firestore, "BoardCollection")
    const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
    const { status: statusBoard, data: boards } = useFirestoreCollectionData(
        query(getBoardByUserId), {
        idField: 'boardId'
    })

    const { status: statusBoardPublic, data: boardPublicData } = useFirestoreCollectionData(
        query(getBoardCollection,
            where("boardVisibility", "==", "Public"),
        ), {
        idField: 'boardId'
    }
    )

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
    const boardData = uniqBy(union((boards as Array<BoardType>), (boardPublicData as Array<BoardType>)), 'boardId')

    //=== End Of Get Workspace From Firestore ===  


    return (
        <div>
            <div className="homePage__content__mid">
                {
                    Array.isArray(workspaceData) && !workspaceData.length ?
                        (
                            <div className="homePage__title">
                                <></>
                            </div>
                        )
                        :
                        (
                            <>
                                <div className="homePage__title">
                                    WORKSPACE DATA
                                </div>
                                <div className="homePage__content">
                                    {workspaceData.map((workspace) => (
                                        <Link to={`/ContentPage/Workspace/${workspace.workspaceId}/`} className="link__workspace">
                                            <div className="homePage__workspaceCard">
                                                <div className="homePage__workspaceCard__title">
                                                    {/* {workspace.workspaceTitle} */}
                                                </div>
                                                <div className="homePage__workspaceCard__content">
                                                    <p>{workspace.workspaceTitle}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                            </>
                        )
                }
                {
                    Array.isArray(boardData) && !boardData.length ?
                        (
                            <></>
                        )
                        :
                        (
                            <>
                                <div className="homePage__title">
                                    BOARD DATA
                                </div>
                                <div className="homePage__content">
                                    {boardData.map((board) => (
                                        <Link to={''} className="link__homePage">
                                            <div className="homePage__boardCard">
                                                <div className="homePage__boardCard__title">
                                                </div>
                                                <div className="homePage__boardCard__content">
                                                    <p>{board.boardTitle} </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )
                }
            </div>
        </div >
    )
}

export default GetHomeData