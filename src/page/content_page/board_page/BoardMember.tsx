import { useState } from 'react'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import NavbarContentPage from '../NavbarContentPage'
import '../../../css/workspaceStyle/Workspace__css.css'
import { Accordion, Alert, Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { BoardInviteEmailType, BoardInviteLinkType, GrantRevokeWorksapce, UserType, WorkspaceInviteEmailType, } from '../../../model/model'
import { useFirestore, useFirestoreCollectionData, } from 'reactfire'
import { addDoc, collection, deleteDoc, doc, query, setDoc, Timestamp, where, writeBatch } from 'firebase/firestore'
import dummyPhoto from '../../../lib/photo/dummy.png';
import { db } from '../../../lib/firebase/config'
import { useUserContext } from '../../../context/UserContext'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { MidContainer, MidContentContainer, MidWorkspaceActionContainer, MidWorkspaceContainer, MidWorkspaceContentContainer, MidWorkspaceContentLeftContainer, MidWorkspaceContentRightContainer, MidWorkspaceTableContainer } from '../../../component/midContent/MidContainer'
import { MidContentTitle, MidWorksapceLeftContent, MidWorkspaceContent, MidWorkspaceRoleName } from '../../../component/midContent/MidContent'
import { SuccessPopUpWithBody, SuccessUpdatePopUp } from '../../../component/modal/Modal'
import { createMilisecond, createTimeFromMilisecond } from '../../../lib/function/DateConversion'
import { GenerateRandomLink } from '../../../lib/function/RandomId'
import { sentEmailBoardInvitation, sentEmailWorkspaceInvitation } from '../../../lib/api/SendEmail'
import LeftBarBoard from './LeftBarBoard'
import { useBoardContext } from '../../../context/BoardContext'
import { useNavigate } from 'react-router-dom'

const BoardMember = () => {

  const workspaceContext = useWorkspaceContext()
  const boardContext = useBoardContext()
  const UserContext = useUserContext()
  const firestore = useFirestore()
  const batch = writeBatch(firestore)
  const navigate = useNavigate()

  const [linkDuration, setLInkDuration] = useState(createMilisecond(20, "seconds"))
  const [link, setLink] = useState(GenerateRandomLink(15, "LIEfTe221B"))
  const [linkInvite, setLinkInvite] = useState(GenerateRandomLink(15, "EMEfTe221B"))

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const handleShowUpdate = () => setShowSuccessUpdate(true);

  const [showLinkPopup, setShowLinkPopUp] = useState(false)
  const handleLinkPopup = () => setShowLinkPopUp(true);

  const [titlePopup, setTitlePopup] = useState("")
  const [bodyPopup, setBodyPopup] = useState("")

  const [invitePopupShow, setInvitePopupShow] = useState(false)
  const handleInvitePopup = () => {
    handleCloseError()
    setInvitePopupShow(true);
    setEmail("")
    setAllEmail([])
  }
  const handleInvitePOpupClose = () => setInvitePopupShow(false);

  const [chooseUser, setChooseUser] = useState("")
  const [grantAdminPopup, setGrantAdminPopup] = useState(false)
  const handleGrantAdminPOpupShow = () => {
    handleCloseError()
    setGrantAdminPopup(true)
    setChooseUser("")
  };
  const handleGrantAdminPOpupClose = () => setGrantAdminPopup(false);

  const [chooseMethodDelete, setChooseMethodDelete] = useState("closeBoard")
  const [boardDeleteMethodPopup, setBoardDeleteMethodPopup] = useState(false)
  const handleBoardDeleteMethodPopupShow = () => {
    handleClose()
    setBoardDeleteMethodPopup(true)
    setChooseMethodDelete("closeBoard")
  }
  const handleBoardDeleteMethodPopupClose = () => setBoardDeleteMethodPopup(false)

  const [email, setEmail] = useState("")
  const [allEmail, setAllEmail] = useState<string[]>([])

  const [showError, setShowError] = useState(false);
  const handleShowError = () => setShowError(true)
  const handleCloseError = () => setShowError(false)


  const [errorMessage, setErrorMessage] = useState("")


  const getUserQuery = collection(useFirestore(), 'UserCollection');
  const { status: statusUser, data: dataUser } = useFirestoreCollectionData(query(getUserQuery), {
    idField: 'uid'
  })

  const getEmailInviteQuery = collection(useFirestore(), 'BoardInviteEmailCollection');
  const { status: statusInvite, data: dataInvite } = useFirestoreCollectionData(
    query(getEmailInviteQuery, where("boardId", "==", boardContext.board.boardId)),
    {
      idField: 'inviteId'
    })

  const getLinkInviteQuery = collection(firestore, 'BoardInviteLinkCollection')
  const { status: statusBoardInviteLink, data: data } = useFirestoreCollectionData(
    query(getLinkInviteQuery, where("boardId", "==", boardContext.board.boardId)), {
    idField: 'linkId'
  })

  if (statusUser === 'loading' || statusInvite === 'loading' || statusBoardInviteLink === 'loading') {
    return (<div>Get Data...</div>)
  }

  const userData = dataUser as Array<UserType>
  const emailInviteData = dataInvite as Array<BoardInviteEmailType>
  const linkData = data as Array<BoardInviteLinkType>
  const usersInvited: string[] = []

  const userEmailInvited = emailInviteData.map((emailInvite) => {
    return emailInvite.userEmailInvited
  })

  userEmailInvited.map((emailInvited) => {
    emailInvited.map((emailUser) => {
      usersInvited.push(emailUser)
    })
  })

  const changeRoleHandle = async ({ roleUser, userId }: GrantRevokeWorksapce) => {
    if (roleUser === "True") {
      roleUser = "False"
      setTitlePopup("Revoke Admin Success")
    } else {
      roleUser = "True"
      setTitlePopup("Grant Admin Success")
    }

    const refUser = doc(firestore, `BoardCollection/${boardContext.board.boardId}/members/${userId}`)
    batch.update(refUser, {
      isAdmin: roleUser
    })

    if (userId === UserContext.user.userId) {
      if (roleUser === 'Admin') {
        boardContext.currentUserBoardRole = "Admin"
      } else {
        boardContext.currentUserBoardRole = "Member"
      }
    }

    await batch.commit();

    handleShowUpdate();
  }

  const createLink = async () => {

    const totalLinkDuration = Timestamp.now().toMillis() + Timestamp.fromMillis(linkDuration as number).toMillis()
    setLink(GenerateRandomLink(15, "LIEfTe221B"))

    const workspaceRef = await addDoc(collection(db, 'BoardInviteLinkCollection'), {
      boardId: boardContext.board.boardId,
      boardTitle: boardContext.board.boardTitle,
      boardWorkspaceId: workspaceContext.workspace.workspaceId,
      link: link,
      timeExpired: totalLinkDuration
    })

    let type: string = ''
    if (Timestamp.fromMillis(linkDuration as number).toMillis() <= 60000) {
      type = "seconds"
    } else if (Timestamp.fromMillis(linkDuration as number).toMillis() < 3600000) {
      type = "minute"
    } else if (Timestamp.fromMillis(linkDuration as number).toMillis() < 86400000) {
      type = "hour"
    } else {
      type = "day"
    }

    handleClose()
    setTitlePopup("Success Create Link")
    setBodyPopup("Invite Link : " + link + " | Expired In " + createTimeFromMilisecond(linkDuration as number, type) + " " + type)
    handleLinkPopup()
  }

  const checkUserHaveChelloAccount = () => {
    const accountData = userData.filter((user) => {
      if (user.email === email) return email
    })

    if (!accountData.length && Array.isArray(accountData)) return false
    else return true
  }

  const checkUserHasJoined = () => {
    const accountData = boardContext.board.boardMembers.filter((user) => {
      if (user.email === email) return email
    })

    if (!accountData.length && Array.isArray(accountData)) return false
    else return true
  }

  const checkUserHasInvited = () => {

    const accountData = usersInvited.filter((emailUser) => {
      if (emailUser === email) return email
    })

    if (!accountData.length && Array.isArray(accountData)) return false
    else return true
  }

  const addEmail = () => {

    if (email.includes("@") === false) {
      setErrorMessage("email must includes @")
      handleShowError()
    } else if (email === UserContext.user.email) {
      setErrorMessage("You can't add your own email")
      handleShowError()
    } else if (checkUserHaveChelloAccount() === false) {
      setErrorMessage("You can't add a user who doesn't have a chello account")
      handleShowError()
    } else if (checkUserHasJoined()) {
      setErrorMessage("The user you want to invite has joined the workspace")
      handleShowError()
    } else if (checkUserHasInvited()) {
      setErrorMessage("The user has been invited")
      handleShowError()
    } else {
      allEmail.push(email)
    }

    setEmail("")
  }

  const sendEmailInvitation = async () => {
    setLinkInvite(GenerateRandomLink(15, "EMEfTe221B"))
    if (!allEmail.length && Array.isArray(allEmail)) {
      setErrorMessage("You need to enter the user's email, at least 1 email")
      handleShowError()
    } else {
      const workspaceRef = await addDoc(collection(db, 'BoardInviteEmailCollection'), {
        boardId: boardContext.board.boardId,
        boardTitle: boardContext.board.boardTitle,
        boardWorkspaceId: workspaceContext.workspace.workspaceId,
        link: linkInvite,
        userEmailInvited: allEmail
      })

      await sentEmailBoardInvitation(
        workspaceContext.workspace.workspaceTitle,
        UserContext.user.username,
        allEmail,
        linkInvite
      )

      setInvitePopupShow(false);
      setEmail("")
      setAllEmail([])
      setTitlePopup("Successfully Send Invitation Email")
      handleShowUpdate()
    }
  }

  const removeUserFromBoard = async (userId: string) => {

    await deleteDoc(doc(firestore, `BoardCollection/${boardContext.board.boardId}/members`, userId));
    await deleteDoc(doc(firestore, `UserCollection/${userId}/memberBoardOf/`, boardContext.board.boardId));

  }

  const leaveFromBoard = async (adminId: string) => {
    let totalAdmin: number = 0;

    for (let i = 0; i < boardContext.board.boardMembers.length; i++) {
      let membersData = boardContext.board.boardMembers[i]
      if (membersData.isAdmin === "True") {
        totalAdmin++;
      }
    }

    if (totalAdmin > 1) {
      removeUserFromBoard(adminId)
      navigate("../../", { replace: true })
    } else if (boardContext.board.boardMembers.length === 1) {
      // make choose close board or reopen board
      handleBoardDeleteMethodPopupShow()
    } else {
      handleGrantAdminPOpupShow()
    }
  }

  const leaveGrantAdmin = async (roleUser: string, adminId: string, userId: string) => {
    if (chooseUser === "") {
      setErrorMessage("You have to choose who you want to give the admin role to")
      handleShowError()
    } else {
      changeRoleHandle({ userId: userId as string, roleUser: roleUser })
      removeUserFromBoard(adminId)
      handleGrantAdminPOpupClose()
      navigate("../../", { replace: true })
    }
  }

  const deleteBoardByMethod = async (boardMethod: string) => {
    if (boardMethod === "closeBoard") {
      const refBoardUser = doc(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf/${boardContext.board.boardId}`)

      batch.update(refBoardUser, {
        boardStatus: "Closed",
        boardWorkspaceId: "",
      })

      const refBoard = doc(firestore, `BoardCollection/${boardContext.board.boardId}`)

      batch.update(refBoard, {
        boardStatus: "Closed",
        boardWorkspaceId: "",
      })

      const newWorkspaceBoardId = workspaceContext.workspace.workspaceBoardId.filter((workspaceBoardId) => {
        if (workspaceBoardId !== boardContext.board.boardId) {
          return workspaceBoardId
        }
      })
  
      //update workspace board id
      const refWorkspace = doc(firestore, `WorkspaceCollection/${workspaceContext.workspace.workspaceId}`)
      batch.update(refWorkspace, {
        workspaceBoardId: newWorkspaceBoardId
      })

      await batch.commit();

      navigate("../../", { replace: true })
    } else if (boardMethod === "permanentlyDeleted") {

      //delete all from memberWorkspaceOf (User Collection)
      for (let i = 0; i < boardContext.board.boardMembers.length; i++) {
        const currentBoardMember = boardContext.board.boardMembers[i]
        deleteDoc(doc(firestore, `UserCollection/${currentBoardMember.docUserId}/memberBoardOf/`, boardContext.board.boardId));
        deleteDoc(doc(firestore, `BoardCollection/${boardContext.board.boardId}/members/`, currentBoardMember.docUserId as string))
      }

      // delete invitation email from board
      for (let i = 0; i < emailInviteData.length; i++) {
        const element = emailInviteData[i];
        deleteDoc(doc(firestore, `BoardInviteEmailCollection`, element.inviteId))
      }

      // delete invitation link from board
      for (let i = 0; i < linkData.length; i++) {
        const element = linkData[i];
        deleteDoc(doc(firestore, `BoardInviteLinkCollection`, element.linkId))
      }

      const newWorkspaceBoardId = workspaceContext.workspace.workspaceBoardId.filter((workspaceBoardId) => {
        if (workspaceBoardId !== boardContext.board.boardId) {
          return workspaceBoardId
        }
      })
    
      console.log(newWorkspaceBoardId)

      //update workspace board id
      const refWorkspace = doc(firestore, `WorkspaceCollection/${workspaceContext.workspace.workspaceId}`)
      batch.update(refWorkspace, {
        workspaceBoardId: newWorkspaceBoardId
      })

      await batch.commit();

      // delete list yang ada di board
      
      // delete list

      // delete card yang ada di list

      // delete card

      //delete Board
      deleteDoc(doc(firestore, `BoardCollection`, boardContext.board.boardId));
      navigate("../../", { replace: true })
    }
  }

  return (
    <div>
      <NavbarContentPage />
      <GeneralContentContainer>
        <LeftBarContainer>
          <LeftBarBoard />
        </LeftBarContainer>
        <MidContainer isDetailPage={false}>
          <MidContentContainer>
            <MidContentTitle titleName={"Board Member"} data={false}></MidContentTitle>
            <MidWorkspaceContainer>
              {
                boardContext.currentUserBoardRole === "Admin" ?
                  (
                    <MidWorkspaceActionContainer>
                      <Button variant="primary" onClick={handleShow}>Invite Via Link</Button>
                      <Button variant="primary" onClick={handleInvitePopup} >Invite Via Email</Button>
                    </MidWorkspaceActionContainer>
                  )
                  :
                  (null)
              }


              <MidWorkspaceTableContainer>
                <MidWorkspaceContentContainer>
                  {
                    boardContext.board.boardMembers.map((boardMember) => (
                      boardContext.currentUserBoardRole === "Admin" ?
                        (
                          <MidWorkspaceContent>
                            <MidWorkspaceContentLeftContainer>
                              <MidWorksapceLeftContent name={boardMember.username} email={boardMember.email} image={dummyPhoto}></MidWorksapceLeftContent>
                            </MidWorkspaceContentLeftContainer>
                            <MidWorkspaceContentRightContainer>
                              {
                                boardMember.isAdmin === "False" ?
                                  (<Button variant="success" size='sm' onClick={() => changeRoleHandle({ userId: boardMember.docUserId as string, roleUser: boardMember.isAdmin })}>Grant Admin</Button>)
                                  :
                                  boardMember.docUserId === UserContext.user.userId ?
                                    (null)
                                    :
                                    (<Button variant="primary" size='sm' onClick={() => changeRoleHandle({ userId: boardMember.docUserId as string, roleUser: boardMember.isAdmin })}>Revoke Admin</Button>)
                              }
                              {
                                boardMember.docUserId === UserContext.user.userId ?
                                  (<Button variant="dark" size='sm' onClick={() => leaveFromBoard(boardMember.docUserId as string)}>Leave</Button>)
                                  :
                                  (<Button variant="danger" size='sm' onClick={() => removeUserFromBoard(boardMember.docUserId as string)}>Remove</Button>)

                              }
                            </MidWorkspaceContentRightContainer>
                          </MidWorkspaceContent>
                        )
                        :
                        (
                          <MidWorkspaceContent>
                            <MidWorkspaceContentLeftContainer>
                              <MidWorksapceLeftContent name={boardMember.username} email={boardMember.email} image={dummyPhoto}></MidWorksapceLeftContent>
                            </MidWorkspaceContentLeftContainer>
                            <MidWorkspaceContentRightContainer>
                              <MidWorkspaceRoleName isAdmin={boardMember.isAdmin}></MidWorkspaceRoleName>
                            </MidWorkspaceContentRightContainer>
                          </MidWorkspaceContent>
                        )

                    ))
                  }
                </MidWorkspaceContentContainer>
              </MidWorkspaceTableContainer>
            </MidWorkspaceContainer>
          </MidContentContainer>
        </MidContainer>
      </GeneralContentContainer>

      <SuccessUpdatePopUp buttonVariant="primary" showSuccessUpdate={showSuccessUpdate} setShowSuccessUpdate={setShowSuccessUpdate} title={titlePopup}></SuccessUpdatePopUp>
      <SuccessPopUpWithBody buttonVariant="primary" showSuccessUpdate={showLinkPopup} setShowSuccessUpdate={setShowLinkPopUp} title={titlePopup} messageBody={bodyPopup}></SuccessPopUpWithBody>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Link Invitation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label htmlFor='disableSelect'>Link Duration</Form.Label>
              <Form.Select onChange={(e) => setLInkDuration(e.target.value as unknown as number)}>
                <option value={createMilisecond(20, "seconds")}>20 seconds</option>
                <option value={createMilisecond(10, "minute")}>10 Minute</option>
                <option value={createMilisecond(1, "hour")}>1 Hour</option>
                <option value={createMilisecond(2, "hour")}>2 Hour</option>
                <option value={createMilisecond(6, "hour")}>6 Hour</option>
                <option value={createMilisecond(12, "hour")}>12 Hour</option>
                <option value={createMilisecond(24, "hour")}>1 Day</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createLink}>Create</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={invitePopupShow}
        onHide={handleInvitePOpupClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Email Invitation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {
              showError === true ?
                (
                  <Row>
                    <Col xs={18} md={12}>
                      <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                        <Alert.Heading>You got an error!</Alert.Heading>
                        <p>
                          {errorMessage}
                        </p>
                      </Alert>
                    </Col>
                  </Row>
                )
                :
                (null)
            }

            <Row>
              <Col xs={12} md={10}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor='disableSelect'>Email</Form.Label>
                    <Form.Control value={email} onChange={(e) => (setEmail(e.target.value))} type="text" placeholder="Enter Email" />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={6} md={2} style={{ alignItems: "center", display: "flex", justifyContent: "center", paddingTop: "15px" }} >
                <Button variant="primary" onClick={addEmail}>Add</Button>
              </Col>
            </Row>

            {
              !allEmail.length && Array.isArray(allEmail) ?
                (null)
                :
                (
                  <Row>
                    <Col xs={18} md={12}>
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>List Email Invite</Accordion.Header>
                          <Accordion.Body>
                            {
                              allEmail.map((userEmail) => (
                                <>
                                  <Button disabled variant="primary" size='sm' style={{ marginBottom: "10px" }}>{userEmail}</Button>
                                  <span>  </span>
                                </>
                              ))
                            }
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Col>
                  </Row>
                )
            }
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleInvitePOpupClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={sendEmailInvitation}>Send Email Invitation</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={grantAdminPopup}
        onHide={handleGrantAdminPOpupClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Grant Admin Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            showError === true ?
              (
                <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                  <Alert.Heading>You got an error!</Alert.Heading>
                  <p>
                    {errorMessage}
                  </p>
                </Alert>
              )
              :
              (null)
          }
          <Form.Group className="mb-3">
            <Form.Label htmlFor='disableSelect'>User Email</Form.Label>
            <Form.Select value={chooseUser} onChange={(e) => setChooseUser(e.target.value)}>
              {
                chooseUser === "" ? (<option selected={true}> choose user </option>) : (null)
              }
              {
                boardContext.board.boardMembers.map((boardMember) => (
                  boardMember.isAdmin === "False" ?
                    (
                      <option value={boardMember.docUserId}>{boardMember.email}</option>
                    )
                    :
                    (null)
                ))
              }
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleGrantAdminPOpupClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => leaveGrantAdmin("False", UserContext.user.userId, chooseUser)}>Continue</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={boardDeleteMethodPopup}
        onHide={handleBoardDeleteMethodPopupClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            showError === true ?
              (
                <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                  <Alert.Heading>You got an error!</Alert.Heading>
                  <p>
                    {errorMessage}
                  </p>
                </Alert>
              )
              :
              (null)
          }
          <Form.Group className="mb-3">
            <Form.Label htmlFor='disableSelect'>Board Delete Method</Form.Label>
            <Form.Select value={chooseMethodDelete} onChange={(e) => setChooseMethodDelete(e.target.value)}>
              <option value={"closeBoard"}>Close Board</option>
              <option value={"permanentlyDeleted"}> Permanently Deleted </option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBoardDeleteMethodPopupClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => deleteBoardByMethod(chooseMethodDelete)}>Continue</Button>
        </Modal.Footer>
      </Modal>
    </div >
  )
}

export default BoardMember