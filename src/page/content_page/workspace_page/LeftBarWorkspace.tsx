import React, { useState } from 'react'
import { AiOutlineHome, AiOutlinePlus, AiOutlineStar } from 'react-icons/ai'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { RiDashboardLine } from 'react-icons/ri'
import { FaRegCalendarAlt, FaUser, FaUsers } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import './style/LeftBarWorkspace__css.css'
import './style/Workspace__css.css'
import { FiSettings } from 'react-icons/fi'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { Button, Form, Modal } from 'react-bootstrap'
import { BoardType, enumBoardVisibility } from '../../../model/model'
import { addDoc, collection, doc, setDoc, writeBatch } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { useFirestore } from 'reactfire'
import { useUserContext } from '../../../context/UserContext'

const LeftBarWorkspace = () => {

  const workspaceContext = useWorkspaceContext()
  const UserContext = useUserContext()
  const { workspaceId } = useParams()
  const firestore = useFirestore()
  const batch = writeBatch(firestore)

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true)
    setBoardVisibility("Private")
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

    const firstBoardUser = ['']
    firstBoardUser.push(UserContext.user.userId)
    console.log(firstBoardUser)

    const boardRef = await addDoc(collection(db, 'BoardCollection'), {
      boardTitle: boardTitle,
      boardVisibility: boardVisibility,
      boardDescription: boardDescription,
      boardWorkspaceId: workspaceId,
    })

    await setDoc(doc(db, `BoardCollection/${boardRef.id}/members`, UserContext.user.userId), {
      username: UserContext.user.username,
      email: UserContext.user.email,
      isAdmin: "True"
    })

    await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/memberBoardOf`, boardRef.id), {
      boardId: boardRef.id.trim(),
      boardTitle: boardTitle
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

  //=== End Of Add Board ===


  return (
    <div className="workspace__content__left__container">
      <div className="workspace__content__left__title__container">
        <div className="workspace__content__left__title">
          <p>{workspaceContext.workspace.workspaceTitle}</p>
        </div>
      </div>
      <Link to={`/ContentPage/Workspace/${workspaceId}/Boards`} className = "workspace__ahref">
        <div className="workspace__content__left">
          <div className="workspace__content__left__icon">
            <MdOutlineSpaceDashboard />
          </div>
          <div className="workspace__content__left__word">
            Board
          </div>
        </div>
      </Link>
      <Link to={`/ContentPage/Workspace/${workspaceId}/Members`} className="workspace__ahref" >
        <div className="workspace__content__left">
          <div className="workspace__content__left__icon">
            <FaUsers />
          </div>
          <div className="workspace__content__left__word">
            Member
          </div>
        </div>
      </Link>
      <Link to={`/ContentPage/Workspace/${workspaceId}/WorkspaceSetting`} className="workspace__ahref" >
        <div className="workspace__content__left">
          <div className="workspace__content__left__icon">
            <FiSettings />
          </div>
          <div className="workspace__content__left__word">
            Setting Workspace
          </div>
        </div>
      </Link>
      <div className="workspace__content__left">
        <div className="workspace__content__left__icon">
          <FaRegCalendarAlt />
        </div>
        <div className="workspace__content__left__word">
          Calendar View
        </div>
      </div>
      {
        workspaceContext.currentUserWorkspaceRole === 'Admin' || workspaceContext.currentUserWorkspaceRole === 'Member'?
        (
        <div className="workspace__content__left" onClick={handleShow}>
          <div className="workspace__content__left__icon">
            <AiOutlinePlus />
          </div>
          <div className="workspace__content__left__word">
            Create Board
          </div>
        </div>
        )
        :
        (
          <></>
        )
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

      {/* MODAL FOR SUCCESS UPDATE */}

      <Modal
        show={showSuccessUpdate}
        onHide={handleCloseSuccess}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Create Board Success</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccess}>OK</Button>
        </Modal.Footer>
      </Modal>

      {/* END MODAL FOR SUCCESS UPDATE */}
    </div>
  )
}

export default LeftBarWorkspace