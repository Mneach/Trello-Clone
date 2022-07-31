import { collection, doc, query, setDoc, Timestamp, where, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { MidContainer, MidContentContainer, MidContentInputContainer, MidInputContainer } from '../../../component/midContent/MidContainer'
import { MidContentTitle } from '../../../component/midContent/MidContent'
import { SuccessUpdatePopUp } from '../../../component/modal/Modal'
import { RightBarContainer } from '../../../component/rightBar/RightContainer'
import { useUserContext } from '../../../context/UserContext'
import { db } from '../../../lib/firebase/config'
import { BoardInviteEmailType, BoardType, WorkspaceType} from '../../../model/model'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'

const BoardInvitationLinkEmail = () => {

    const UserContext = useUserContext()
    const { linkInvitation } = useParams()
    const firestore = useFirestore()
    const navigate = useNavigate()
    const batch = writeBatch(firestore)

    const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
    const handleShow = () => setShowSuccessUpdate(true);

    const getPublicWorkspace = collection(firestore, 'BoardInviteEmailCollection')
    const { status: statusWorkspaceInvite, data: data } = useFirestoreCollectionData(
        query(getPublicWorkspace, where("link", "==", linkInvitation)), {
        idField: 'CollectionId'
    })

    const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
    const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
        idField: 'CollectionId'
    })

    const getEmailInviteQuery = collection(useFirestore(), 'BoardInviteEmailCollection');
    const { status: statusInvite, data: dataInvite } = useFirestoreCollectionData(
        query(getEmailInviteQuery, where("link", "==", linkInvitation)),
        {
            idField: 'inviteId'
        })

    const getWorkspaceData = collection(useFirestore() , 'WorkspaceCollection')
    const {status : statusAllWorkspace , data : allWorkspaceData } = useFirestoreCollectionData(
        query(getWorkspaceData) , { idField : 'workspaceId'}
    )

    if (statusWorkspaceInvite === 'loading' || statusWorkspace === 'loading' || statusInvite === 'loading' || statusAllWorkspace === 'loading') {
        return (<div>GETTING INVITATION DATA</div>)
    }

    const boardInviteData = (data as Array<BoardInviteEmailType>)[0]
    const boardData = workspaceses as Array<BoardType>
    const emailInviteData = dataInvite as Array<BoardInviteEmailType>
    const workspaceData = allWorkspaceData as Array<WorkspaceType>
    const usersInvited: string[] = []

    const boardUserData = boardData.filter((board) => {
        if (board.boardId === boardInviteData.boardId) {
            return board
        }
    })

    const userEmailInvited = emailInviteData.map((emailInvite) => {
        return emailInvite.userEmailInvited
    })

    const detailWorkspace = workspaceData.filter((workspace) => {
        if(workspace.workspaceId === boardInviteData.boardWorkspaceId){
            return workspace
        }
    })

    userEmailInvited.map((emailInvited) => {
        emailInvited.map((emailUser) => {
            usersInvited.push(emailUser)
        })
    })

    const user = usersInvited.filter((emailUser) => {
        return UserContext.user.email === emailUser
    })
    console.log(emailInviteData[0].inviteId)
    console.log(detailWorkspace[0])

    const joinWorkspace = async () => {

        const newInvitedUser = usersInvited.filter((userinvited) => {
            return userinvited !== user[0]
        })

        console.log(newInvitedUser)
        console.log(emailInviteData[0].inviteId)

        await setDoc(doc(db, `BoardCollection/${boardInviteData.boardId}/members`, UserContext.user.userId), {
            username: UserContext.user.username,
            email: UserContext.user.email,
            isAdmin: "False"
        })

        await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/memberBoardOf`, boardInviteData.boardId), {
            boardId: boardInviteData.boardId,
            boardTitle: boardInviteData.boardTitle,
            boardStatus : "Open",
            boardWorkspaceId : boardInviteData.boardWorkspaceId
        })

        const refUser = doc(firestore, `BoardInviteEmailCollection/${emailInviteData[0].inviteId}`)
        batch.update(refUser, {
            userEmailInvited : newInvitedUser
        })

        await setDoc(doc(db, `WorkspaceCollection/${boardInviteData.boardWorkspaceId}/members`, UserContext.user.userId), {
            username: UserContext.user.username,
            email: UserContext.user.email,
            isAdmin: "False"
        })

        await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf`, detailWorkspace[0].workspaceId), {
            workspaceId: detailWorkspace[0].workspaceId,
            workspaceTitle: detailWorkspace[0].workspaceTitle
        })

        await batch.commit();

        navigate("../workspace/" + boardInviteData.boardWorkspaceId + "/Board/" + boardInviteData.boardId , { replace: true })
    }
    return (
        <div>
            <NavbarContentPage />
            <GeneralContentContainer>
                <LeftBarContainer>
                    <LeftBarContentPage />
                </LeftBarContainer>
                <MidContainer isDetailPage={false}>
                    {
                        Array.isArray(user) && !user.length ?
                            (
                                <MidContentContainer>
                                    <MidContentTitle titleName={" You are not eligible to access this link "} data={false}></MidContentTitle>
                                </MidContentContainer>
                            )
                            :

                            Array.isArray(boardUserData) && !boardUserData.length ?
                                (
                                    <MidContentContainer>
                                        <MidContentTitle titleName={"Click Join Button To Join [ " + boardInviteData.boardTitle + " ] Board"} data={false}></MidContentTitle>
                                        <MidContentInputContainer>
                                            <MidInputContainer>
                                                <Button variant="primary" size='lg' onClick={joinWorkspace}>Join Board</Button>
                                            </MidInputContainer>
                                        </MidContentInputContainer>
                                    </MidContentContainer>
                                )
                                :
                                (
                                    <MidContentContainer>
                                        <MidContentTitle titleName={"You Have Joined [ " + boardInviteData.boardTitle + " ] Board"} data={false}></MidContentTitle>
                                    </MidContentContainer>
                                )
                    }
                </MidContainer>
                <RightBarContainer>
                    <RightBarContentPage />
                </RightBarContainer>
            </GeneralContentContainer>

            <SuccessUpdatePopUp buttonVariant="Primary" title={"Join Board " + boardInviteData.boardTitle + "Success"} showSuccessUpdate={showSuccessUpdate} setShowSuccessUpdate={setShowSuccessUpdate}></SuccessUpdatePopUp>
        </div >
    )
}

export default BoardInvitationLinkEmail