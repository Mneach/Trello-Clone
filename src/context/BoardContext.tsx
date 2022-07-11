import { collection, doc, query, where } from 'firebase/firestore';
import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreCollection, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { BoardMember, BoardType, enumBoardVisibility, enumWorkspaceVisibility, UserType, WorkspaceMember, WorkspaceType } from '../model/model';
import { useUserContext } from './UserContext';


type Props = {
    children: React.ReactNode | React.ReactFragment;
}

type boardContextProps = {
    board: BoardType,
    currentUserBoardRole : string
}

export function useBoardContext() {
    return useContext(BoardContext)
}

const BoardContext = React.createContext<boardContextProps>({
    board: {
        boardId: '',
        boardTitle: '',
        boardVisibility: enumBoardVisibility.Private,
        boardDescription: '',
        boardMembers: [],
        boardWorkspaceId : '',
    },
    currentUserBoardRole : ''
})



const BoardProvider : React.FC<Props> = ({ children }) => {    

    const firestore = useFirestore()
    const { boardId } = useParams()
    const UserContext = useUserContext()
    
    const getBoardDetail = doc(firestore, 'BoardCollection', boardId as string)
    const { status: statusBoardDetail, data: boardDetail } = useFirestoreDocData(getBoardDetail)
    
    const getBoardMember = collection(firestore, `BoardCollection/${boardId as string}/members/`)
    const { status: statusBoardMember, data: boardMember } = useFirestoreCollectionData(
        query(getBoardMember) , {
            idField : 'docUserId'
        })
        
        if (statusBoardDetail === 'loading' || statusBoardMember === 'loading') {
            return (<div>GET BOARD DATA...</div>)
        }

        const boardDetailData = boardDetail as BoardType
        boardDetailData.boardId = boardId as string
        boardDetailData.boardMembers = boardMember as Array<BoardMember>
        
        let checkUserIsBoardMember : boolean = false
        let indexCurrentUser : number = -1
        let userBoardRole = ''
        // console.log(workspaceId)
        // console.log(workspaceMember)
        for (let index = 0; index < boardDetailData.boardMembers.length; index++) {
            if(boardDetailData.boardMembers[index].docUserId === UserContext.user.userId){
            checkUserIsBoardMember = true;
            indexCurrentUser = index
        }  
    }
    
    if(checkUserIsBoardMember == true){
        if(boardDetailData.boardMembers[indexCurrentUser].isAdmin === true){
            userBoardRole = "Admin"
        }else{
            userBoardRole = "Member"
        }
    }else{
        userBoardRole = "Guest"
    }  
    
    console.log(userBoardRole)

    return (
        <BoardContext.Provider value={{ board: boardDetailData , currentUserBoardRole : userBoardRole}} >
            {children}
        </BoardContext.Provider>
    )
}
export default BoardProvider