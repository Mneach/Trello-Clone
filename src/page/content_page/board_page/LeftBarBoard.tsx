import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaRegCalendarAlt, FaUsers } from 'react-icons/fa'
import { FiSettings, FiStar } from 'react-icons/fi'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { GoStar } from 'react-icons/go'
import { Link, useParams } from 'react-router-dom'
import { useBoardContext } from '../../../context/BoardContext'
import { useUserContext } from '../../../context/UserContext'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { db } from '../../../lib/firebase/config'
import '../../../css/boardStyle/LeftBarBoard__css.css'
import { CreateButton, LinkButton } from '../../../component/leftBar/Button'
import { LeftBarTitleContainer } from '../../../component/leftBar/LeftContainer'
import { LeftBarTitle } from '../../../component/leftBar/ContentTitle'
import { Button, Form, Modal } from 'react-bootstrap'

const LeftBarBoard = () => {

    const BoardContext = useBoardContext()
    const WorkspaceContext = useWorkspaceContext()
    const UserContext = useUserContext()
    const workspaceId = WorkspaceContext.workspace.workspaceId
    const { boardId } = useParams()
    const [checkFavoriteBoard, setCheckFavoriteBoard] = useState(UserContext.favoriteBoard.includes(boardId as string))

    const [listName, setListName] = useState("")
    const [listPopup, setListPopup] = useState(false)
    const showListPopup = () => setListPopup(true)
    const closeListPopup = () => {
        setListPopup(false)
        setListName("")
    }


    const markBoardFavoriteHandle = async () => {
        await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/favoriteBoard`, boardId as string), {
            boardId: boardId,
            boardTitle: BoardContext.board.boardTitle,
            boardWorkspaceId: WorkspaceContext.workspace.workspaceId,
            boardStatus: "Open"
        })

        UserContext.favoriteBoard.push(boardId as string)
        setCheckFavoriteBoard(true)
    }

    const unMarkBoardFavoriteHandle = async () => {
        await deleteDoc(doc(db, `UserCollection/${UserContext.user.userId}/favoriteBoard`, boardId as string))

        UserContext.favoriteBoard.push(boardId as string)
        let index = UserContext.favoriteBoard.indexOf(boardId as string)
        if (index > -1) {
            UserContext.favoriteBoard.splice(index, 1)
        }

        setCheckFavoriteBoard(false)
        console.log(UserContext.favoriteBoard)
    }

    const createList = async () => {

        const listRef = await addDoc(collection(db, 'ListCollection'), {
            listName: listName,
            boardId : BoardContext.board.boardId
        })

        await setDoc(doc(db, `BoardCollection/${BoardContext.board.boardId}/Lists`, listRef.id as string), {
            listId: listRef.id,
            listName: listName,
            boardId : BoardContext.board.boardId
        })

        closeListPopup()
    }

    return (
        <>
            <LeftBarTitleContainer>
                <LeftBarTitle type='board' titleName={BoardContext.board.boardTitle}></LeftBarTitle>
            </LeftBarTitleContainer>
            <LinkButton icon={<MdOutlineSpaceDashboard />} linkTo={`/ContentPage/Workspace/${workspaceId}/Board/${boardId}/BoardContent`} linkName={"Board Content"} ></LinkButton>
            <LinkButton icon={<FaUsers />} linkTo={`/ContentPage/Workspace/${workspaceId}/Board/${boardId}/BoardMembers`} linkName={"Board Member"} ></LinkButton>
            <LinkButton icon={<FiSettings />} linkTo={`/ContentPage/Workspace/${workspaceId}/Board/${boardId}/BoardSetting`} linkName={"Setting Board"} ></LinkButton>
            {
                checkFavoriteBoard === true ?
                    (
                        <div className="board__content__left" onClick={unMarkBoardFavoriteHandle}>
                            <div className="board__content__left__icon">
                                <GoStar />
                            </div>
                            <div className="board__content__left__word">
                                Unmark Board As Favorite
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className="board__content__left" onClick={markBoardFavoriteHandle}>
                            <div className="board__content__left__icon">
                                <FiStar />
                            </div>
                            <div className="board__content__left__word">
                                Mark Board As Favorite
                            </div>
                        </div>
                    )
            }

            <CreateButton icon={<AiOutlinePlus />} name="Create List" setShow={setListPopup}></CreateButton>

            <Modal
                show={listPopup}
                onHide={closeListPopup}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formControlsText">
                            <Form.Label>List Name</Form.Label>
                            <Form.Control value={listName} onChange={(e) => setListName(e.target.value)} type="text" placeholder="Enter List Name" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeListPopup}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={createList}>Continue</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LeftBarBoard