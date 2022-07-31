import React, { useState } from 'react'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'
import GetBoardDataHome from '../../../lib/getData/GetBoardDataHome'
import '../../../css/homeStyle/Home__css.css'
import { MidContainer, MidContentCardContainer, MidContentContainer, MidContentInputContainer, MidInputContainer } from '../../../component/midContent/MidContainer'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { RightBarContainer } from '../../../component/rightBar/RightContainer'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserContext } from '../../../context/UserContext'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { collection, doc, query, where, writeBatch } from 'firebase/firestore'
import { BoardMember, BoardType, WorkspaceType } from '../../../model/model'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { MidContentTitle } from '../../../component/midContent/MidContent'
import { union, uniqBy } from 'lodash'

const HomeCloseBoardDetail = () => {


    const { boardId } = useParams()

    const UserContext = useUserContext()
    const firestore = useFirestore()
    const navigate = useNavigate()
    const WorkspaceContext = useWorkspaceContext()
    const batch = writeBatch(firestore)

    const [showError, setShowError] = useState(false);
    const handleShowError = () => setShowError(true)
    const handleCloseError = () => setShowError(false)

    const [chooseWorkspace, setChooseWorkspace] = useState("")
    const [reopenBoardPopup, setReopenBoardPoup] = useState(false)
    const handleReopenBoardPopupShow = () => {
        handleCloseError()
        setReopenBoardPoup(true)
        setChooseWorkspace("")
    };
    const handleReopenBoardPopupClose = () => setReopenBoardPoup(false);

    //=== Get Board From Firestore ===

    const getBoardByUserId = collection(firestore, `BoardCollection/${boardId}/members/`)
    const { status: statusBoard, data: boards } = useFirestoreCollectionData(
        query(getBoardByUserId, where("isAdmin", "==", "True")), {
        idField: 'docUserId'
    })

    const getAllBoardMember = collection(firestore, `BoardCollection/${boardId}/members/`)
    const { status: statusBoardMember, data: boardMembers } = useFirestoreCollectionData(
        query(getAllBoardMember), {
        idField: 'docUserId'
    })


    const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf/`)
    const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
        idField: 'workspaceId'
    })

    const getWorkspaceAll = collection(firestore, 'WorkspaceCollection')
    const { status: statusWorkspaceAll, data: workspaceAll } = useFirestoreCollectionData(
        query(getWorkspaceAll), {
        idField: 'workspaceId'
    }) 


    if (statusWorkspace === 'loading' || statusBoard === 'loading' || statusBoardMember === 'loading' || statusWorkspaceAll == 'loading') {
        return (<div>Getting Board Data....</div>)
    }

    const boardMembersData = boardMembers as Array<BoardMember>
    const boardUserData = boards as Array<BoardMember>
    const userWorkspaceData = workspaceses as Array<WorkspaceType>
    const workspaceAllData = workspaceAll as Array<WorkspaceType>

    const workspaceData: Array<WorkspaceType> = userWorkspaceData

    const checkUserAdmin = boardUserData.filter((userData) => {
        return userData.docUserId === UserContext.user.userId
    })

    console.log(boards)
    console.log(boardUserData)
    console.log(checkUserAdmin)
    console.log(boardMembersData)

    const reopenBoard = async () => {
        if(chooseWorkspace === ""){
            handleShowError()
        }else{
            //update board
            const refBoard = doc(firestore, "BoardCollection", boardId as string)
            batch.update(refBoard, {
                boardWorkspaceId: chooseWorkspace,
                boardStatus : "Open"
            })
        
            
            //update ke semua member of boards
            for (let i = 0; i < boardMembersData.length; i++) {
                const memberUserId = boardMembersData[i].docUserId;
                
                const refUser = doc(firestore, `UserCollection/${memberUserId}/memberBoardOf/`, boardId as string)
                batch.update(refUser, {
                    boardWorkspaceId: chooseWorkspace,
                    boardStatus : "Open"
                })               
            }
            
            //update ke workspacenya
            const selectedWorkspace = workspaceAllData.filter((workspace) => {
                return workspace.workspaceId === chooseWorkspace
            })

            const worksapceSelectedData = (selectedWorkspace as Array<WorkspaceType>)[0]
            console.log(worksapceSelectedData)
            worksapceSelectedData.workspaceBoardId.push(boardId as string)

            const refWorkspace = doc(firestore, `WorkspaceCollection`, chooseWorkspace as string)
            batch.update(refWorkspace, {
                workspaceBoardId : worksapceSelectedData.workspaceBoardId
            })      


            await batch.commit();
            navigate(`../workspace/${worksapceSelectedData.workspaceId}/Board/${boardId}` , { replace: true })
        }
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
                        Array.isArray(checkUserAdmin) && !checkUserAdmin.length ?
                            (
                                <MidContentContainer>
                                    <MidContentTitle titleName={" you have to wait until the admin reopens this board so you can see the content on this board "} data={false}></MidContentTitle>
                                </MidContentContainer>
                            )
                            :
                            (
                                <MidContentContainer>
                                    <MidContentTitle titleName={"If you want to reopen the board, click the button below"} data={false}></MidContentTitle>
                                    <MidContentInputContainer>
                                        <MidInputContainer>
                                            <Button variant="primary" size='lg' onClick={handleReopenBoardPopupShow}>Reopen Board</Button>
                                        </MidInputContainer>
                                    </MidContentInputContainer>
                                </MidContentContainer>
                            )

                    }
                </MidContainer>
                <RightBarContainer>
                    <RightBarContentPage />
                </RightBarContainer>
            </GeneralContentContainer>

            <Modal
                show={reopenBoardPopup}
                onHide={handleReopenBoardPopupClose}
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
                                    you have to choose a workspace
                                    </p>
                                </Alert>
                            )
                            :
                            (null)
                    }
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor='disableSelect'>Workspace List</Form.Label>
                        <Form.Select value={chooseWorkspace} onChange={(e) => setChooseWorkspace(e.target.value)}>
                            {
                                chooseWorkspace === "" ? (<option selected={true}> choose workspace </option>) : (null)
                            }
                            {
                                workspaceData.map((workspace) => (
                                    <option value={workspace.workspaceId}>{workspace.workspaceTitle}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleReopenBoardPopupClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => reopenBoard()}>Continue</Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default HomeCloseBoardDetail