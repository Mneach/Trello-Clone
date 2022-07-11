import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineHome, AiOutlinePlus, AiOutlineStar } from 'react-icons/ai'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { RiDashboardLine } from 'react-icons/ri'
import { useUserContext } from '../../context/UserContext'
import { useFirestore } from 'reactfire'
import { auth, db } from '../../firebase/config'
import { addDoc, collection, doc, query, setDoc, where } from 'firebase/firestore'
import { Modal, ModalBody, ModalDialog, Button, Form, Card, Navbar } from 'react-bootstrap'
import './LeftBarContentPage__css.css'


const LeftBarContentPage = () => {

  const UserContext = useUserContext()
  const firestore = useFirestore()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const handleCloseSuccess = () => setShowSuccessUpdate(false);
  const handleShowUpdate = () => setShowSuccessUpdate(true);
  //=== GETTER SETTER WORKSPACE ===

  const [workspaceTitle, setWorkspaceTitle] = useState('')
  const [workspaceVisibility, setWorkspaceVisibility] = useState('Private')
  const [workspaceDescription, setWorkspaceDescription] = useState('')

  //=== END OF GETTER SETTER WORKSPACE ===

  //=== Add workspace to DB ===

  const createWorksapce = async () => {
    const workspaceRef = await addDoc(collection(db, 'WorkspaceCollection'), {
      workspaceTitle: workspaceTitle,
      workspaceVisibility: workspaceVisibility,
      workspaceDescription: workspaceDescription,
      workspaceBoardId : []
    })

    await setDoc(doc(db, `WorkspaceCollection/${workspaceRef.id}/members`, UserContext.user.userId), {
      username: UserContext.user.username,
      email: UserContext.user.email,
      isAdmin: true
    })

    await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf`, workspaceRef.id), {
      workspaceId: workspaceRef.id.trim(),
      workspaceTitle: workspaceTitle
    })

    setWorkspaceTitle('')
    setWorkspaceDescription('')
    setWorkspaceVisibility('')

    handleClose()
    handleShowUpdate()
  }
  //=== End Of Add Workspace ===
  return (
    <div className="homePage__content__left__container">
      <Link to={'/ContentPage/'} className="homePage__ahref" >
        <div className="homePage__content__left">
          <div className="homePage__content__left__icon">
            <AiOutlineHome />
          </div>
          <div className="homePage__content__left__word">
            Home
          </div>
        </div>
      </Link>
      <Link to={'/ContentPage/FavoriteBoards'} className="homePage__ahref" >
        <div className="homePage__content__left">
          <div className="homePage__content__left__icon">
            <AiOutlineStar />
          </div>
          <div className="homePage__content__left__word">
            Favorite Board
          </div>
        </div>
      </Link>
      <div className="homePage__content__left">
        <div className="homePage__content__left__icon">
          <AiOutlineStar />
        </div>
        <div className="homePage__content__left__word">
          Favorite Workspace
        </div>
      </div>
      <Link to={'/ContentPage/Workspace'} className="homePage__ahref" >
        <div className="homePage__content__left">
          <div className="homePage__content__left__icon">
            <RiDashboardLine />
          </div>
          <div className="homePage__content__left__word">
            Workspace
          </div>
        </div>
      </Link>
      <Link to={'/ContentPage/Boards'} className = "homePage__ahref">
        <div className="homePage__content__left">
          <div className="homePage__content__left__icon">
            <MdOutlineSpaceDashboard />
          </div>
          <div className="homePage__content__left__word">
            Board
          </div>
      </div>
      </Link>
      <div className="homePage__content__left" onClick={handleShow}>
        <div className="homePage__content__left__icon">
          <AiOutlinePlus />
        </div>
        <div className="homePage__content__left__word">
          Create Workspace
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formControlsText">
              <Form.Label>Workspace Title</Form.Label>
              <Form.Control value={workspaceTitle} onChange={(e) => setWorkspaceTitle(e.target.value)} type="text" placeholder="Enter Workspace Title" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor='disableSelect'>Workspace Visibility</Form.Label>
              <Form.Select onChange={(e) => setWorkspaceVisibility(e.target.value)}>
                <option value={"Private"}>Private</option>
                <option value={"Public"}>Public</option>
              </Form.Select>
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Workspace Description</Form.Label>
              <Form.Control value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value)} as="textarea" placeholder='Enter Workspace Description' rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createWorksapce}>Continue</Button>
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
          <Modal.Title>Create Workspace Success</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccess}>OK</Button>
        </Modal.Footer>
      </Modal>

      {/* END MODAL FOR SUCCESS UPDATE */}
    </div>


  )
}

export default LeftBarContentPage