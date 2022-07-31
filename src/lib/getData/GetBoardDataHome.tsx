import { useUserContext } from '../../context/UserContext'
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { BoardHomeType, BoardType } from '../../model/model'
import { union, uniqBy } from 'lodash'
import { MidContainer, MidContentCardContainer, MidContentContainer } from '../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../component/midContent/MidContent'
import { useWorkspaceContext } from '../../context/WorkspaceContext'

const GetBoardDataHome = () => {

  const UserContext = useUserContext()
  const firestore = useFirestore()
  const WorkspaceContext = useWorkspaceContext()

  //=== Get Board From Firestore ===

  const getBoardCollection = collection(firestore, "BoardCollection")

  const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
  const { status: statusBoard, data: boards } = useFirestoreCollectionData(
    query(getBoardByUserId , where("boardStatus" , "==" , "Open")), {
    idField: 'boardId'
  })

  const { status: statusBoardPublic, data: boardPublicData } = useFirestoreCollectionData(
    query(getBoardCollection,
      where("boardVisibility", "==", "Public"),
      where("boardStatus" , "==" , "Open"),
    ), {
    idField: 'boardId'
  }
  )

  if (statusBoard === 'loading' || statusBoardPublic === 'loading') {
    return (<div>Getting Board Data....</div>)
  }

  console.log(boards)
  console.log(boardPublicData)

  let boardData : Array<BoardHomeType> = []

  boardData = uniqBy(union((boards as Array<BoardHomeType>), (boardPublicData as Array<BoardHomeType>)), 'boardId')

  console.log(boardData)

  //=== End Of Get homePage From Firestore ===  

  if (Array.isArray(boardData) && !boardData.length) {
    return (
      <MidContentContainer>
        <MidContentTitle titleName={" THERE IS NO BOARD DATA "} data={false}></MidContentTitle>
      </MidContentContainer>
    )
  } else {
    return (
      <MidContentContainer>
        <MidContentTitle titleName={"BOARD DATA"} data={true}></MidContentTitle>
        <MidContentCardContainer>
          {boardData.map((board) => (
            <MidContentCard type={"Board"} content={board.boardTitle} linkTo={`/ContentPage/Workspace/${board.boardWorkspaceId}/Board/${board.boardId}`} ></MidContentCard>
          ))}
        </MidContentCardContainer>
      </MidContentContainer>
    )
  }
}

export default GetBoardDataHome 
