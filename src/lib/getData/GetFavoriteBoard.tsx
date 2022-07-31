import { collection, query, where } from 'firebase/firestore'
import React from 'react'
import { Link } from 'react-router-dom'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { MidContainer, MidContentCardContainer, MidContentContainer } from '../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../component/midContent/MidContent'
import { useUserContext } from '../../context/UserContext'
import { BoardHomeType, BoardType } from '../../model/model'


const GetFavoriteBoard = () => {
    const UserContext = useUserContext()
    const firestore = useFirestore()

    //=== Get Workspace From Firestore ===

    const getBoardQuery = collection(firestore, `UserCollection/${UserContext.user.userId}/favoriteBoard/`)
    const { status: statusWorkspace, data: boardData } = useFirestoreCollectionData(
        query(getBoardQuery , where("boardStatus" , "==" , "Open")), {
        idField: 'uid'
    })

    if (statusWorkspace === 'loading') {
        return (<div>GETTING BOARD DATA</div>)
    }

    const boards = boardData as Array<BoardHomeType>


    //=== End Of Get Workspace From Firestore ===  

    if (Array.isArray(boards) && !boards.length) {
        return (
            <MidContentContainer>
                <MidContentTitle titleName={" THERE IS NO FAVORITE BOARD "} data={false}></MidContentTitle>
            </MidContentContainer> 
        )
    } else {
        return (
            <MidContentContainer>
                <MidContentTitle titleName={" FAVORITE BOARD DATA "} data={true}></MidContentTitle>
                <MidContentCardContainer>
                    {boards.map((board) => (
                        <MidContentCard type={"Board"} content={board.boardTitle} linkTo={`/ContentPage/Workspace/${board.boardWorkspaceId}/Board/${board.boardId}`} ></MidContentCard>
                    ))}
                </MidContentCardContainer>
            </MidContentContainer>
        )
    }
}


export default GetFavoriteBoard