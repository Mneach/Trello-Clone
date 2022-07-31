import { collection, doc, Firestore, query, setDoc, Timestamp, where } from 'firebase/firestore'
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
import { BoardInviteLinkType, BoardType, WorkspaceInviteLinkType, WorkspaceType } from '../../../model/model'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'

const BoardInvitationLink = () => {

    const UserContext = useUserContext()
    const { linkInvitation } = useParams()
    const firestore = useFirestore()
    const navigate = useNavigate()

    const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
    const handleShow = () => setShowSuccessUpdate(true);

    const getPublicWorkspace = collection(firestore, 'BoardInviteLinkCollection')
    const { status: statusWorkspaceInvite, data: data } = useFirestoreCollectionData(
        query(getPublicWorkspace, where("link", "==", linkInvitation)), {
        idField: 'CollectionId'
    })

    const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/`)
    const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
        idField: 'CollectionId'
    })


    if (statusWorkspaceInvite === 'loading' || statusWorkspace === 'loading') {
        return (<div>GETTING INVITATION DATA</div>)
    }

    const boardInviteData = (data as Array<BoardInviteLinkType>)[0]

    const boardData = workspaceses as Array<BoardType>

    const boardUserData = boardData.filter((board) => {
        if (board.boardId === boardInviteData.boardId) {
            return board
        }
    })

    let expiredLink: boolean = false

    if (Timestamp.now().toMillis() > boardInviteData.timeExpired) {
        expiredLink = true
    } else {
        expiredLink = false
    }

    console.log(boardInviteData)
    console.log(workspaceses)
    console.log(boardUserData)

    const joinWorkspace = async () => {
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
                        Array.isArray(boardInviteData) && !boardInviteData.length ?
                            (
                                <MidContentContainer>
                                    <MidContentTitle titleName={" LINK INVALID "} data={false}></MidContentTitle>
                                </MidContentContainer>
                            )
                            :
                            expiredLink === true ?
                                (
                                    <MidContentContainer>
                                        <MidContentTitle titleName={"LINK EXPIRED "} data={false}></MidContentTitle>
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

            <SuccessUpdatePopUp buttonVariant="Primary" title={"Join Workspace " + boardInviteData.boardTitle + "Success"} showSuccessUpdate={showSuccessUpdate} setShowSuccessUpdate={setShowSuccessUpdate}></SuccessUpdatePopUp>
        </div >
    )
}

export default BoardInvitationLink