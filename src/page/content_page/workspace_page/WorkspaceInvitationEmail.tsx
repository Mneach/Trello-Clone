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
import { WorkspaceInviteEmailType, WorkspaceInviteLinkType, WorkspaceType } from '../../../model/model'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'

const WorkspaceInvitationLinkEmail = () => {

    const UserContext = useUserContext()
    const { linkInvitation } = useParams()
    const firestore = useFirestore()
    const navigate = useNavigate()
    const batch = writeBatch(firestore)

    const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
    const handleShow = () => setShowSuccessUpdate(true);

    const getPublicWorkspace = collection(firestore, 'WorkspaceInviteEmailCollection')
    const { status: statusWorkspaceInvite, data: data } = useFirestoreCollectionData(
        query(getPublicWorkspace, where("link", "==", linkInvitation)), {
        idField: 'CollectionId'
    })

    const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf/`)
    const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
        idField: 'CollectionId'
    })

    const getEmailInviteQuery = collection(useFirestore(), 'WorkspaceInviteEmailCollection');
    const { status: statusInvite, data: dataInvite } = useFirestoreCollectionData(
        query(getEmailInviteQuery, where("link", "==", linkInvitation)),
        {
            idField: 'inviteId'
        })


    if (statusWorkspaceInvite === 'loading' || statusWorkspace === 'loading' || statusInvite === 'loading') {
        return (<div>GETTING INVITATION DATA</div>)
    }

    const workspaceInviteData = (data as Array<WorkspaceInviteLinkType>)[0]
    const workspaceData = workspaceses as Array<WorkspaceType>
    const emailInviteData = dataInvite as Array<WorkspaceInviteEmailType>
    const usersInvited: string[] = []

    const workspaceUserData = workspaceData.filter((workspace) => {
        if (workspace.workspaceId === workspaceInviteData.workspaceId) {
            return workspace
        }
    })

    const userEmailInvited = emailInviteData.map((emailInvite) => {
        return emailInvite.userEmailInvited
    })

    userEmailInvited.map((emailInvited) => {
        emailInvited.map((emailUser) => {
            usersInvited.push(emailUser)
        })
    })

    const user = usersInvited.filter((emailUser) => {
        return UserContext.user.email === emailUser
    })

    const joinWorkspace = async () => {

        const newInvitedUser = usersInvited.filter((userinvited) => {
            return userinvited !== user[0]
        })

        console.log(newInvitedUser)
        console.log(emailInviteData[0].inviteId)

        await setDoc(doc(db, `WorkspaceCollection/${workspaceInviteData.workspaceId}/members`, UserContext.user.userId), {
            username: UserContext.user.username,
            email: UserContext.user.email,
            isAdmin: "False"
        })

        await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf`, workspaceInviteData.workspaceId), {
            workspaceId: workspaceInviteData.workspaceId,
            workspaceTitle: workspaceInviteData.workspaceTitle
        })

        const refUser = doc(firestore, `WorkspaceInviteEmailCollection/${emailInviteData[0].inviteId}`)
        batch.update(refUser, {
            userEmailInvited : newInvitedUser
        })
        
        await batch.commit();

        navigate("../workspace/" + workspaceInviteData.workspaceId , { replace: true })
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

                            Array.isArray(workspaceUserData) && !workspaceUserData.length ?
                                (
                                    <MidContentContainer>
                                        <MidContentTitle titleName={"Click Join Button To Join [ " + workspaceInviteData.workspaceTitle + " ] Workspace"} data={false}></MidContentTitle>
                                        <MidContentInputContainer>
                                            <MidInputContainer>
                                                <Button variant="primary" size='lg' onClick={joinWorkspace}>Join Workspace</Button>
                                            </MidInputContainer>
                                        </MidContentInputContainer>
                                    </MidContentContainer>
                                )
                                :
                                (
                                    <MidContentContainer>
                                        <MidContentTitle titleName={"You Have Joined [ " + workspaceInviteData.workspaceTitle + " ] Workspace"} data={false}></MidContentTitle>
                                    </MidContentContainer>
                                )
                    }
                </MidContainer>
                <RightBarContainer>
                    <RightBarContentPage />
                </RightBarContainer>
            </GeneralContentContainer>

            <SuccessUpdatePopUp buttonVariant="Primary" title={"Join Workspace " + workspaceInviteData.workspaceTitle + "Success"} showSuccessUpdate={showSuccessUpdate} setShowSuccessUpdate={setShowSuccessUpdate}></SuccessUpdatePopUp>
        </div >
    )
}

export default WorkspaceInvitationLinkEmail