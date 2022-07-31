import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { FaRegCalendarAlt, FaUsers } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import '../../../css/workspaceStyle/Workspace__css.css'
import { FiSettings } from 'react-icons/fi'
import { BiMinusCircle } from 'react-icons/bi'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { Button, Form, Modal } from 'react-bootstrap'
import { enumBoardVisibility, WorkspaceInviteEmailType, WorkspaceInviteLinkType } from '../../../model/model'
import { addDoc, collection, deleteDoc, doc, query, setDoc, where, writeBatch } from 'firebase/firestore'
import { db } from '../../../lib/firebase/config'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { useUserContext } from '../../../context/UserContext'
import { SuccessUpdatePopUp } from '../../../component/modal/Modal'
import { LeftBarContainer, LeftBarTitleContainer } from '../../../component/leftBar/LeftContainer'
import { CreateButton, LinkButton } from '../../../component/leftBar/Button'
import { LeftBarTitle } from '../../../component/leftBar/ContentTitle'

const LeftBarWorkspace = () => {

  const workspaceContext = useWorkspaceContext()
  const UserContext = useUserContext()
  const { workspaceId } = useParams()
  const firestore = useFirestore()
  const navigate = useNavigate()
  const batch = writeBatch(firestore)

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true)
    setBoardVisibility("Private")
  };

  const [deletePopup, setDeletePopup] = useState(false);
  const handleDeletePopupClose = () => setDeletePopup(false);
  const handleDeletePopupShow = () => {
    setDeletePopup(true)
  };

  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const handleCloseSuccess = () => setShowSuccessUpdate(false);
  const handleShowUpdate = () => setShowSuccessUpdate(true);

  //=== GETTER SETTER Board ===

  const [boardTitle, setBoardTitle] = useState('')
  const [boardVisibility, setBoardVisibility] = useState('Private')
  const [boardDescription, setBoardDescription] = useState('')

  //=== END OF GETTER SETTER Board ===

  //=== Add Board to DB ===

  const createBoard = async () => {

    const boardRef = await addDoc(collection(db, 'BoardCollection'), {
      boardTitle: boardTitle,
      boardVisibility: boardVisibility,
      boardDescription: boardDescription,
      boardWorkspaceId: workspaceId,
      boardStatus: "Open"
    })

    await setDoc(doc(db, `BoardCollection/${boardRef.id}/members`, UserContext.user.userId), {
      username: UserContext.user.username,
      email: UserContext.user.email,
      isAdmin: "True"
    })

    await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/memberBoardOf`, boardRef.id), {
      boardId: boardRef.id.trim(),
      boardTitle: boardTitle,
      boardWorkspaceId: workspaceId,
      boardStatus: "Open"
    })

    const newWorkspaceBoardId = Array.from(workspaceContext.workspace.workspaceBoardId)
    newWorkspaceBoardId.push(boardRef.id)
    const refUser = doc(firestore, "WorkspaceCollection", workspaceContext.workspace.workspaceId as string);
    batch.update(refUser, {
      workspaceBoardId: newWorkspaceBoardId
    })
    await batch.commit();

    setBoardTitle('')
    setBoardDescription('')
    setBoardVisibility("private")

    handleClose()
    handleShowUpdate()

  }

  // console.log(boardVisibility)
  const getEmailInviteQuery = collection(useFirestore(), 'WorkspaceInviteEmailCollection');
  const { status: statusInvite, data: dataInvite } = useFirestoreCollectionData(
    query(getEmailInviteQuery, where("workspaceId", "==", workspaceContext.workspace.workspaceId)),
    {
      idField: 'inviteId'
    })

  const getLinkInviteQuery = collection(firestore, 'WorkspaceInviteLinkCollection')
  const { status: statusWorkspaceInvite, data: data } = useFirestoreCollectionData(
    query(getLinkInviteQuery, where("workspaceId", "==", workspaceContext.workspace.workspaceId)), {
    idField: 'linkId'
  })

  if (statusInvite === 'loading' || statusWorkspaceInvite === 'loading') {
    return (<div>Getting data... </div>)
  }



  const invitedData = dataInvite as Array<WorkspaceInviteEmailType>
  const linkData = data as Array<WorkspaceInviteLinkType>

  //=== End Of Add Board ===

  const deleteWorkspace = async () => {

    // delete all from memberWorkspaceOf (User Collection)
    for (let i = 0; i < workspaceContext.workspace.workspaceMembers.length; i++) {
      const currentWorkspaceMember = workspaceContext.workspace.workspaceMembers[i]
      deleteDoc(doc(firestore, `UserCollection/${currentWorkspaceMember.docUserId}/memberWorkspaceOf/`, workspaceContext.workspace.workspaceId));
      deleteDoc(doc(firestore, `WorkspaceCollection/${workspaceContext.workspace.workspaceId}/members/`, currentWorkspaceMember.docUserId as string))

      for (let i = 0; i < workspaceContext.workspace.workspaceBoardId.length; i++) {
        const currentBoardId = workspaceContext.workspace.workspaceBoardId[i]
        const refBoardUser = doc(firestore, `UserCollection/${currentWorkspaceMember.docUserId}/memberBoardOf/${currentBoardId}`)

        console.log(refBoardUser)

        batch.update(refBoardUser, {
          boardStatus: "Closed",
          boardWorkspaceId: "",
        })

      }
    }

    //Update status Board to closed
    for (let i = 0; i < workspaceContext.workspace.workspaceBoardId.length; i++) {
      const currentBoardId = workspaceContext.workspace.workspaceBoardId[i]
      const refBoard = doc(firestore, `BoardCollection/${currentBoardId}`)

      batch.update(refBoard, {
        boardStatus: "Closed",
        boardWorkspaceId: "",
      })

    }
    await batch.commit();


    // delete invitation email from workspacee
    for (let i = 0; i < invitedData.length; i++) {
      const element = invitedData[i];
      deleteDoc(doc(firestore, `WorkspaceInviteEmailCollection`, element.inviteId))
    }

    // delete invitation link from workspacee
    for (let i = 0; i < linkData.length; i++) {
      const element = linkData[i];
      deleteDoc(doc(firestore, `WorkspaceInviteLinkCollection`, element.linkId))
    }

    //delete workspace 
    deleteDoc(doc(firestore, `WorkspaceCollection`, workspaceContext.workspace.workspaceId));

    navigate("../../", { replace: true })
  }
  return (
    <>
      <LeftBarTitleContainer>
        <LeftBarTitle type='workspace' titleName={workspaceContext.workspace.workspaceTitle}></LeftBarTitle>
      </LeftBarTitleContainer>
      <LinkButton icon={<MdOutlineSpaceDashboard />} linkTo={`/ContentPage/Workspace/${workspaceId}/Boards`} linkName={"Board"} ></LinkButton>
      <LinkButton icon={<FaUsers />} linkTo={`/ContentPage/Workspace/${workspaceId}/Members`} linkName={"Member"} ></LinkButton>
      <LinkButton icon={<FiSettings />} linkTo={`/ContentPage/Workspace/${workspaceId}/WorkspaceSetting`} linkName={"Setting Workspace"} ></LinkButton>
      <LinkButton icon={<FaRegCalendarAlt />} linkTo={`/ContentPage/Workspace/${workspaceId}/CalenderView`} linkName={"Calendar View"} ></LinkButton>
      {
        workspaceContext.currentUserWorkspaceRole === 'Admin' || workspaceContext.currentUserWorkspaceRole === 'Member' ?
          (<CreateButton icon={<AiOutlinePlus />} name={"Create Board"} setShow={setShow}></CreateButton>)
          :
          (null)
      }
      {
        workspaceContext.currentUserWorkspaceRole === 'Admin' ?
          (<CreateButton icon={<BiMinusCircle />} name={"DeleteWorkspace"} setShow={setDeletePopup}></CreateButton>)
          :
          (null)
      }

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formControlsText">
              <Form.Label>Board Title</Form.Label>
              <Form.Control value={boardTitle} onChange={(e) => setBoardTitle(e.target.value)} type="text" placeholder="Enter Workspace Title" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor='disableSelect'>Board Visibility </Form.Label>
              <Form.Select onChange={(e) => setBoardVisibility(e.target.value)}>
                {
                  Object.keys(enumBoardVisibility).map((boardVisibilityData) => {
                    return (
                      <option value={boardVisibilityData}>{boardVisibilityData}</option>
                    )
                  })
                }
              </Form.Select>
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Board Description</Form.Label>
              <Form.Control value={boardDescription} onChange={(e) => setBoardDescription(e.target.value)} as="textarea" placeholder='Enter Workspace Description' rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createBoard}>Continue</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={deletePopup}
        onHide={handleDeletePopupClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are u sure want to delete this workspace ? </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeletePopupClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={deleteWorkspace}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <SuccessUpdatePopUp buttonVariant="primary" showSuccessUpdate={showSuccessUpdate} setShowSuccessUpdate={setShowSuccessUpdate} title={"Create Board Success"}></SuccessUpdatePopUp>

    </>
  )
}

export default LeftBarWorkspace