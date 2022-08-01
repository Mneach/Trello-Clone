import { addDoc, collection, doc, Firestore, query, setDoc, Timestamp, where } from 'firebase/firestore'
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
import GetHomeData from '../../../lib/getData/GetHomeData'
import { WorkspaceInviteLinkType, WorkspaceType } from '../../../model/model'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'

const WorkspaceInvitationLink = () => {

  const UserContext = useUserContext()
  const { linkInvitation } = useParams()
  const firestore = useFirestore()
  const navigate = useNavigate()

  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const handleShow = () => setShowSuccessUpdate(true);

  const getPublicWorkspace = collection(firestore, 'WorkspaceInviteLinkCollection')
  const { status: statusWorkspaceInvite, data: data } = useFirestoreCollectionData(
    query(getPublicWorkspace, where("link", "==", linkInvitation)), {
    idField: 'CollectionId'
  })

  const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf/`)
  const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
    idField: 'CollectionId'
  })


  if (statusWorkspaceInvite === 'loading' || statusWorkspace === 'loading') {
    return (<div>GETTING INVITATION DATA</div>)
  }

  const workspaceInviteData = (data as Array<WorkspaceInviteLinkType>)[0]

  const workspaceData = workspaceses as Array<WorkspaceType>

  const workspaceUserData = workspaceData.filter((workspace) => {
    if (workspace.workspaceId === workspaceInviteData.workspaceId) {
      return workspace
    }
  })

  let expiredLink: boolean = false

  if (Timestamp.now().toMillis() > workspaceInviteData.timeExpired) {
    expiredLink = true
  } else {
    expiredLink = false
  }

  console.log(workspaceInviteData)
  console.log(workspaceses)
  console.log(workspaceUserData)

  const joinWorkspace = async () => {

    const workspaceRef = await addDoc(collection(db, 'WorkspaceNotifications'), {
      workspaceId : workspaceInviteData.workspaceId,
      notificationTitle : "New Workspace Member!",
      notificationMessage : `${UserContext.user.username} has joined the [ ${workspaceInviteData.workspaceTitle} ] workspace Via Link Invitation`

    })

    await setDoc(doc(db, `WorkspaceCollection/${workspaceInviteData.workspaceId}/members`, UserContext.user.userId), {
      username: UserContext.user.username,
      email: UserContext.user.email,
      isAdmin: "False"
    })

    await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf`, workspaceInviteData.workspaceId), {
      workspaceId: workspaceInviteData.workspaceId,
      workspaceTitle: workspaceInviteData.workspaceTitle
    })


    navigate("../workspace/" + workspaceInviteData.workspaceId +"/Boards" , { replace: true })
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
            Array.isArray(workspaceInviteData) && !workspaceInviteData.length ?
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

export default WorkspaceInvitationLink