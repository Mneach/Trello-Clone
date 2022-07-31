import { doc, writeBatch } from 'firebase/firestore'
import { useState } from 'react'
import { useFirestore } from 'reactfire'
import { useUserContext } from '../../../context/UserContext'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { enumBoardVisibility, enumWorkspaceVisibility } from '../../../model/model'
import NavbarContentPage from '../NavbarContentPage'
import LeftBarWorkspace from './LeftBarWorkspace'
import '../../../css/workspaceStyle/Workspace__css.css'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { MidContainer, MidContentContainer, MidContentInputContainer, MidInputContainer } from '../../../component/midContent/MidContainer'
import { MidContentTitle } from '../../../component/midContent/MidContent'
import { SuccessUpdatePopUp } from '../../../component/modal/Modal'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { InputSelectVisibility, InputSubmit, InputText, InputTextArea } from '../../../component/midContent/MidForm'

const WorkspaceSetting = () => {

  const UserContext = useUserContext()
  const workspaceContext = useWorkspaceContext()
  const [workspaceTitle, setWorkspaceTitle] = useState(workspaceContext.workspace.workspaceTitle)
  const [workspaceDescription, setWorkspaceDescription] = useState(workspaceContext.workspace.workspaceDescription)
  const [workspaceVisibility, setWorkspaceVisibiltiy] = useState<enumWorkspaceVisibility | enumBoardVisibility>(workspaceContext.workspace.workspaceVisibility)
  const firestore = useFirestore()
  const batch = writeBatch(firestore)

  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const handleClose = () => setShowSuccessUpdate(false);
  const handleShow = () => setShowSuccessUpdate(true);

  console.log(workspaceTitle)

  const updateWorkspaceHandle = async () => {

    const refWorkspace = doc(firestore, "WorkspaceCollection", workspaceContext.workspace.workspaceId as string);
    batch.update(refWorkspace, {
      workspaceTitle: workspaceTitle,
      workspaceVisibility: workspaceVisibility,
      workspaceDescription: workspaceDescription
    })

    const refUser = doc(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf`, workspaceContext.workspace.workspaceId as string)
    batch.update(refUser, {
      workspaceTitle: workspaceTitle
    })

    await batch.commit()

    handleShow()
  }

  return (
    <div>
      <NavbarContentPage />
      <GeneralContentContainer>
        <LeftBarContainer>
          <LeftBarWorkspace />
        </LeftBarContainer>
        <MidContainer isDetailPage={false}>
          <MidContentContainer>
            <MidContentTitle titleName={" Worksapce Setting "} data={false}></MidContentTitle>
            <MidContentInputContainer>
              <MidInputContainer>
                <label htmlFor="email">Workspace Title</label>
                {
                    (<InputText type='text' value={workspaceTitle} setValue={setWorkspaceTitle} isDisable={true}></InputText>)
                }
                
                <label htmlFor='privacySetting'>Workspace Visibility</label>
                {
                  workspaceContext.currentUserWorkspaceRole === 'Admin' ?
                    (<InputSelectVisibility value={workspaceVisibility} setValue={setWorkspaceVisibiltiy} isDisable={false} enumType={"workspace"}></InputSelectVisibility>)
                    :
                    (<InputSelectVisibility value={workspaceVisibility} setValue={setWorkspaceVisibiltiy} isDisable={true} enumType={"workspace"}></InputSelectVisibility>)
                }
                
                <label htmlFor="WorkspaceDescription">Workspace Description</label>
                {
                  workspaceContext.currentUserWorkspaceRole === 'Admin' ?
                    (
                      <>
                        <InputTextArea isDisable={false} value={workspaceDescription} setValue={setWorkspaceDescription}></InputTextArea>
                        <InputSubmit valueName={"SAVE"} onClickFunction ={updateWorkspaceHandle}></InputSubmit>
                      </>
                    )
                    :
                    (<InputTextArea isDisable={true} value={workspaceDescription} setValue={setWorkspaceDescription}></InputTextArea>)
                  }
              </MidInputContainer>
            </MidContentInputContainer>
          </MidContentContainer>
        </MidContainer>
      </GeneralContentContainer>
      <SuccessUpdatePopUp buttonVariant="primary" title={"Update Success"} showSuccessUpdate={showSuccessUpdate} setShowSuccessUpdate={setShowSuccessUpdate}></SuccessUpdatePopUp>
    </div >
  )
}

export default WorkspaceSetting