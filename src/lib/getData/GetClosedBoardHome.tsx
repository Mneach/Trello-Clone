import { useUserContext } from '../../context/UserContext'
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { BoardHomeType, BoardType } from '../../model/model'
import { union, uniqBy } from 'lodash'
import { MidContainer, MidContentCardContainer, MidContentContainer } from '../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../component/midContent/MidContent'
import { useWorkspaceContext } from '../../context/WorkspaceContext'

const GetCloseBoardHome = () => {

    const UserContext = useUserContext()
    const firestore = useFirestore()
    const WorkspaceContext = useWorkspaceContext()

    //=== Get Board From Firestore ===

    const getBoardCollection = collection(firestore, "BoardCollection")

    const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
    const { status: statusBoard, data: boards } = useFirestoreCollectionData(
        query(getBoardByUserId, where("boardStatus", "==", "Closed")), {
        idField: 'boardId'
    })

    if (statusBoard === 'loading') {
        return (<div>Getting Board Data....</div>)
    }

    console.log(boards)
    const closeBoardData = boards as Array<BoardHomeType>

    //=== End Of Get homePage From Firestore ===  

    if (Array.isArray(closeBoardData) && !closeBoardData.length) {
        return (
            <MidContentContainer>
                <MidContentTitle titleName={" THERE IS NO CLOSE BOARD DATA "} data={false}></MidContentTitle>
            </MidContentContainer>
        )
    } else {
        return (
            <MidContentContainer>
                <MidContentTitle titleName={"CLOSE BOARD DATA"} data={true}></MidContentTitle>
                <MidContentCardContainer>
                    {closeBoardData.map((board) => (
                        <MidContentCard type={"CloseBoard"} content={board.boardTitle} linkTo={`/ContentPage/ClosedBoard/${board.boardId}`} ></MidContentCard>
                    ))}
                </MidContentCardContainer>
            </MidContentContainer>
        )
    }
}

export default GetCloseBoardHome 
