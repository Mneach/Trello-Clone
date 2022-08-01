import { useState } from 'react'
import { AiOutlineHome, AiOutlinePlus, AiOutlineStar } from 'react-icons/ai'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { ImUserPlus } from 'react-icons/im'
import { RiDashboardLine, RiUserAddFill } from 'react-icons/ri'
import { BiWindowClose } from 'react-icons/bi'
import { useUserContext } from '../../context/UserContext'
import { db } from '../../lib/firebase/config'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { Modal, Button, Form, } from 'react-bootstrap'
import { CreateButton, LinkButton } from '../../component/leftBar/Button'
import { SuccessUpdatePopUp } from '../../component/modal/Modal'
import { Navigate, useNavigate } from 'react-router-dom'
import { replace } from 'lodash'
import { BsCreditCard2Front } from 'react-icons/bs'


const LeftBarContentPage = () => {

  const UserContext = useUserContext()
  const navigate = useNavigate()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showJoinWorkspace, setShowJoinWorkspace] = useState(false);
  const handlShowJoinWorkspacePopup = () => {setShowJoinWorkspace(true)};
  const handlCloseJoinWorkspacePopup = () => {
    setShowJoinWorkspace(false)
    setLinkInvitaion("")
  };

  const [showJoinBoard, setShowJoinBoard] = useState(false);
  const handlShowJoinBoardPopup = () => setShowJoinBoard(true);
  const handlCloseJoinBoardPopup = () => {
    setShowJoinBoard(false)
    setLinkInvitaion("")
  };  

  const [showViewCard, setShowViewCard] = useState(false);
  const handleCloseViewCardPopup = () => {
    setShowViewCard(false)
    setLinkInvitaion("")
  };  

  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const handleShowUpdate = () => setShowSuccessUpdate(true);
  //=== GETTER SETTER WORKSPACE ===

  const [workspaceTitle, setWorkspaceTitle] = useState('')
  const [workspaceVisibility, setWorkspaceVisibility] = useState('Private')
  const [workspaceDescription, setWorkspaceDescription] = useState('')
  const [linkInvitaion, setLinkInvitaion] = useState("")

  const [viewCardLink, setViewCardLink] = useState("")

  //=== END OF GETTER SETTER WORKSPACE ===

  //=== Add workspace to DB ===

  const createWorksapce = async () => {
    const workspaceRef = await addDoc(collection(db, 'WorkspaceCollection'), {
      workspaceTitle: workspaceTitle,
      workspaceVisibility: workspaceVisibility,
      workspaceDescription: workspaceDescription,
      workspaceBoardId: []
    })

    await setDoc(doc(db, `WorkspaceCollection/${workspaceRef.id}/members`, UserContext.user.userId), {
      username: UserContext.user.username,
      email: UserContext.user.email,
      isAdmin: "True"
    })

    await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf`, workspaceRef.id), {
      workspaceId: workspaceRef.id.trim(),
      workspaceTitle: workspaceTitle
    })

    setWorkspaceTitle('')
    setWorkspaceDescription('')
    setWorkspaceVisibility('')

    handleClose()
    navigate(`../Workspace/${workspaceRef.id}/` , {replace : true})
  }
  //=== End Of Add Workspace ===

  const joinWorkspaceViaLink = () => {
    if (linkInvitaion.startsWith("LIEfTe221W")) {
      navigate("../WorkspaceInviteLink/" + linkInvitaion, { replace: true })
    } else if (linkInvitaion.startsWith("EMEfTe221W")) {
      navigate("../WorkspaceInviteEmail/" + linkInvitaion, { replace: true })
    } else {
      navigate("../WorkspaceInviteError/" + linkInvitaion, { replace: true })
    }
    handlCloseJoinWorkspacePopup()
    setLinkInvitaion("")
  }

  const CardLinkView = () => {
    if (linkInvitaion.startsWith("CAEfTe221")) {
      navigate("../BoardViewCardLInk/" + linkInvitaion, { replace: true })
    }else{
      navigate("../BoardInviteError/" + linkInvitaion, { replace: true })
    }
  }

  const joinBoardViaLink = () => {
    if (linkInvitaion.startsWith("LIEfTe221B")) {
      navigate("../BoardInviteLink/" + linkInvitaion, { replace: true })
    } else if (linkInvitaion.startsWith("EMEfTe221B")) {
      navigate("../BoardInviteEmail/" + linkInvitaion, { replace: true })
    } else {
      navigate("../BoardInviteError/" + linkInvitaion, { replace: true })
    }
    handlCloseJoinWorkspacePopup()
    setLinkInvitaion("")
  }  
  
  return (
    <div>
      <LinkButton icon={<AiOutlineHome />} linkTo={'/ContentPage/'} linkName={"Home"} ></LinkButton>
      <LinkButton icon={<AiOutlineStar />} linkTo={'/ContentPage/FavoriteBoards'} linkName={"Favorite Board"} ></LinkButton>
      <LinkButton icon={<RiDashboardLine />} linkTo={'/ContentPage/Workspace'} linkName={"Workspace"} ></LinkButton>
      <LinkButton icon={<MdOutlineSpaceDashboard />} linkTo={'/ContentPage/Boards'} linkName={"Board"} ></LinkButton>
      <LinkButton icon={<BiWindowClose />} linkTo={'/ContentPage/ClosedBoard'} linkName={"Closed Board"} ></LinkButton>
      <CreateButton icon={<AiOutlinePlus />} name={"Create Worksapce"} setShow={setShow} />
      <CreateButton icon={<ImUserPlus />} name={"Join Worksapce"} setShow={setShowJoinWorkspace} />
      <CreateButton icon={<RiUserAddFill />} name={"Join Board"} setShow={setShowJoinBoard} />
      <CreateButton icon={<BsCreditCard2Front />} name={"View Card"} setShow={setShowViewCard} />

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

      <Modal
        show={showJoinWorkspace}
        onHide={handlCloseJoinWorkspacePopup}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Join Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formControlsText">
              <Form.Label>Invite Link</Form.Label>
              <Form.Control value={linkInvitaion} onChange={(e) => setLinkInvitaion(e.target.value)} type="text" placeholder="Enter Invite Link" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlCloseJoinWorkspacePopup}>
            Cancel
          </Button>
          <Button variant="primary" onClick={joinWorkspaceViaLink}>Continue</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showJoinBoard}
        onHide={handlCloseJoinBoardPopup}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Join Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formControlsText">
              <Form.Label>Invite Link</Form.Label>
              <Form.Control value={linkInvitaion} onChange={(e) => setLinkInvitaion(e.target.value)} type="text" placeholder="Enter Invite Link" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlCloseJoinBoardPopup}>
            Cancel
          </Button>
          <Button variant="primary" onClick={joinBoardViaLink}>Continue</Button>
        </Modal.Footer>
      </Modal>
      <SuccessUpdatePopUp buttonVariant="primary" showSuccessUpdate={showSuccessUpdate} setShowSuccessUpdate={setShowSuccessUpdate} title={"Create Workspace Success"}></SuccessUpdatePopUp>
    
      <Modal
        show={showViewCard}
        onHide={handleCloseViewCardPopup}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>View Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formControlsText">
              <Form.Label>Card Link</Form.Label>
              <Form.Control value={linkInvitaion} onChange={(e) => setLinkInvitaion(e.target.value)} type="text" placeholder="Enter Card Link" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewCardPopup}>
            Cancel
          </Button>
          <Button variant="primary" onClick={CardLinkView}>Continue</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default LeftBarContentPage