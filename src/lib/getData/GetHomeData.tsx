import { collection, query, where } from 'firebase/firestore'
import { union, uniqBy } from 'lodash'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { MidContentCardContainer, MidContentContainer } from '../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../component/midContent/MidContent'
import { useUserContext } from '../../context/UserContext'
import { useWorkspaceContext } from '../../context/WorkspaceContext'
import { BoardHomeType, BoardType, cardType, WorkspaceType } from '../../model/model'

const GetHomeData = () => {
    const UserContext = useUserContext()
    const firestore = useFirestore()
    const WorkspaceContext = useWorkspaceContext()

    //=== Get Workspace From Firestore ===

    const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf/`)
    const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
        idField: 'workspaceId'
    })

    const getBoardCollection = collection(firestore, "BoardCollection")
    const getBoardByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
    const { status: statusBoard, data: boards } = useFirestoreCollectionData(
        query(getBoardByUserId , where("boardStatus" , "==" , "Open")), {
        idField: 'boardId'
    })

    const { status: statusBoardPublic, data: boardPublicData } = useFirestoreCollectionData(
        query(getBoardCollection,
            where("boardVisibility", "==", "Public"),
            where("boardStatus" , "==" , "Open")
        ), {
        idField: 'boardId'
    }
    )

    const getPublicWorkspace = collection(firestore, 'WorkspaceCollection')
    const { status: statusWorkspacePublic, data: publicWorkspace } = useFirestoreCollectionData(
        query(getPublicWorkspace, where("workspaceVisibility", "==", "Public")), {
        idField: 'workspaceId'
    })

    const getCardQuery = collection(firestore, 'CardCollection')
    const { status: statusCardData, data: dataCard } = useFirestoreCollectionData(
        query(getCardQuery, where("boardId", "==", "Public")), {
        idField: 'workspaceId'
    })


    if (statusWorkspace === 'loading' || statusCardData === 'loading' || statusWorkspacePublic === 'loading' || statusBoardPublic === 'loading' || statusBoard === 'loading') {
        return (<div>GETTING WORKSPACE DATA</div>)
    }

    const userWorkspaceData = workspaceses as Array<WorkspaceType>
    const publicWorkspaceData = publicWorkspace as Array<WorkspaceType>
    const cardData = dataCard as Array<cardType>
    console.log(publicWorkspaceData)

    const workspaceData: Array<WorkspaceType> = uniqBy(union((userWorkspaceData), (publicWorkspaceData)), 'workspaceId')
    const boardData = uniqBy(union((boards as Array<BoardHomeType>), (boardPublicData as Array<BoardHomeType>)), 'boardId')

    const realCardData = cardData.filter((cardData) => {
        for (let i = 0; i < boardData.length; i++) {
            const element = boardData[i];
            if(element.boardId === cardData.boardId && element.boardStatus !== "Public") return cardData
        }
    })


    //=== End Of Get Workspace From Firestore ===  

    if (Array.isArray(boardData) && !boardData.length && Array.isArray(workspaceData) && !workspaceData.length) {
        return (
            <MidContentContainer>
                <MidContentTitle titleName={" THERE IS NO DATA "} data={false}></MidContentTitle>
            </MidContentContainer>
        )
    } else {
        return (
            <>
                {
                    Array.isArray(workspaceData) && !workspaceData.length ? null :
                        (
                            <MidContentContainer>
                                <MidContentTitle titleName={"WORKSPACE DATA"} data={true}></MidContentTitle>
                                <MidContentCardContainer>
                                    {workspaceData.map((workspace) => (
                                        <MidContentCard type="Workspace" content={workspace.workspaceTitle} linkTo={`/ContentPage/Workspace/${workspace.workspaceId}/Boards`} ></MidContentCard>
                                    ))}
                                </MidContentCardContainer>
                            </MidContentContainer>
                        )
                } {
                    Array.isArray(boardData) && !boardData.length ? null :
                        (
                            <MidContentContainer>
                                <MidContentTitle titleName={"BOARD DATA"} data={true}></MidContentTitle>
                                <MidContentCardContainer>
                                    {boardData.map((board) => (
                                        <MidContentCard type={"Board"} content={board.boardTitle} linkTo={`/ContentPage/Workspace/${board.boardWorkspaceId}/Board/${board.boardId}`} ></MidContentCard>
                                    ))}
                                </MidContentCardContainer>
                            </MidContentContainer>
                        )
                } {
                    Array.isArray(realCardData) && !realCardData.length ? null :
                        (
                            <MidContentContainer>
                                <MidContentTitle titleName={"Card Data"} data={true}></MidContentTitle>
                                <MidContentCardContainer>
                                    {realCardData.map((card) => (
                                        <MidContentCard type={"Board"} content={card.cardName} linkTo={`/ContentPage/Workspace/${card.workspaceId}/Board/${card.boardId}`} ></MidContentCard>
                                    ))}
                                </MidContentCardContainer>
                            </MidContentContainer>
                        )
                }
            </>
        )
    }
}

export default GetHomeData