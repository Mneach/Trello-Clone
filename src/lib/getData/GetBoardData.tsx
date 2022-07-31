import { useUserContext } from '../../context/UserContext'
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { BoardType } from '../../model/model'
import { union, uniqBy } from 'lodash'
import { Link } from 'react-router-dom'
import { useWorkspaceContext } from '../../context/WorkspaceContext'
import '../../css/boardStyle/Board__css.css'
import { MidContainer, MidContentCardContainer, MidContentContainer } from '../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../component/midContent/MidContent'

const GetBoardData = () => {

    const UserContext = useUserContext()
    const WorkspaceContext = useWorkspaceContext()
    const firestore = useFirestore()

    //=== Get Board From Firestore ===

    const getBoardCollection = collection(firestore, "BoardCollection")

    // const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
    // const { status: statusBoard, data: boards } = useFirestoreCollectionData(
    //     query(getBoardByUserId), {
    //     idField: 'boardId'
    // })

    const { status: statusBoardPublic, data: boardPublicData } = useFirestoreCollectionData(
        query(getBoardCollection,
            where("boardVisibility", "==", "Public"),
            where("boardWorkspaceId", "==", WorkspaceContext.workspace.workspaceId),
            where("boardStatus" , "==" , "Open")
        ), {
        idField: 'boardId'
    }
    )

    const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
    const { status: statusBoard, data: boards } = useFirestoreCollectionData(
        query(getBoardByUserId , where("boardStatus" , "==" , "Open") , where("boardWorkspaceId", "==", WorkspaceContext.workspace.workspaceId)), {
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

    //=== End Of Get Workspace From Firestore ===  

    if (Array.isArray(boardData) && !boardData.length) {
        return (
            <MidContentContainer>
                <MidContentTitle titleName={"THERE IS NO BOARD"} data={false}></MidContentTitle>
            </MidContentContainer>
        )
    } else {
        return (
            <MidContentContainer>
                <MidContentTitle titleName={"BOARD DATA"} data={true}></MidContentTitle>
                <MidContentCardContainer>
                    {boardData.map((board) => (
                        <MidContentCard type={"Board"} content={board.boardTitle} linkTo={`/ContentPage/Workspace/${WorkspaceContext.workspace.workspaceId}/Board/${board.boardId}`} ></MidContentCard>
                    ))}
                </MidContentCardContainer>
            </MidContentContainer>
        )
    }
}

export default GetBoardData 