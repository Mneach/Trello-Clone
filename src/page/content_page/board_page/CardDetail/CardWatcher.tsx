import { addDoc, collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Form, Modal, ProgressBar, ToggleButton } from 'react-bootstrap'
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { CreateIconButton } from '../../../../component/leftBar/Button'
import { midStyleBoard } from '../../../../component/midContent/style/midStyle_css'
import { BoardMember, cardChecklistType, cardType, cardWathcerType } from '../../../../model/model'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GenerateRandomLink } from '../../../../lib/function/RandomId'
import { db } from '../../../../lib/firebase/config'
import { useUserContext } from '../../../../context/UserContext'
import { useBoardContext } from '../../../../context/BoardContext'

const CardWatcher = ({ realCardDetail }: { realCardDetail: cardType }) => {

    const BoardContext = useBoardContext()
    const UserContext = useUserContext()

    const firestore = useFirestore()
    const batch = writeBatch(firestore)

    const [inputCardWatcher, setInputCardWatcher] = useState("")
    const [displayCardWatcher, setDisplayCardWatcher] = useState("flex")
    const [displayInputCardLink, setDisplayInputCardLink] = useState("none")

    const getCardCollection = collection(firestore, "CardWatcher")
    const { status: statusGetCardData, data: dataWacher } = useFirestoreCollectionData(
        query(getCardCollection, where("cardId", "==", realCardDetail.cardId)
        ), {
        idField: 'watcherId'
    })

    if (statusGetCardData === 'loading') {
        return (<div>Get Watcher Data...</div>)
    }

    const watcherData = dataWacher as Array<cardWathcerType>

    const filterCardWatcherByuserID = BoardContext.board.boardMembers.filter((boardMember) => {
        if (boardMember.docUserId !== UserContext.user.userId) return boardMember
    })

    const enableBeCardWatcher: Array<BoardMember> = []

    for (let index = 0; index < filterCardWatcherByuserID.length; index++) {
        const cardWatcherFilter = filterCardWatcherByuserID[index];
        let check: boolean = false

        for (let b = 0; b < watcherData.length; b++) {
            const element = watcherData[b];
            if (cardWatcherFilter.docUserId === element.userId) {
                check = true;
                break
            }
        }

        if (check === true) {
            continue;
        } else {
            enableBeCardWatcher.push(cardWatcherFilter)
        }
    }


    const addLinkClicked = () => {
        setDisplayCardWatcher("none")
        setDisplayInputCardLink("block")
        setInputCardWatcher("")
    }

    const cancelLinkClicked = () => {
        setDisplayCardWatcher("flex")
        setDisplayInputCardLink("none")
        setInputCardWatcher("")
    }

    const deleteCardWatcher = async (watcherId: string) => {
        await deleteDoc(doc(db, `CardWatcher/${watcherId}`))
    }

    const createCardWatcher = async () => {

        const newWatcherData = enableBeCardWatcher.filter((a) => {
            if (a.docUserId === inputCardWatcher) return a
        })

        const cardWatcher = await addDoc(collection(db, 'CardWatcher'), {
            userId: inputCardWatcher,
            cardId: realCardDetail.cardId,
            cardWatcherName: newWatcherData[0].username,
        })
    }

    return (
        Array.isArray(watcherData) && !watcherData.length ?
            (
                <>
                    {
                        BoardContext.currentUserBoardRole === 'Admin' ?
                            (
                                <>
                                    <ToggleButton onClick={() => addLinkClicked()} style={{ width: "100%", display: `${displayCardWatcher}`, justifyContent: "flex-start", alignItems: "center" }} className="mb-2" id="toggle-check" type="checkbox" variant="outline-success" value={realCardDetail.cardId}>
                                        <span style={{ display: "flex", alignItems: "center" }}><AiOutlinePlus></AiOutlinePlus> Add Card Watcher </span>
                                    </ToggleButton>
                                    <Form style={{ width: "100%", display: `${displayInputCardLink}` }}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Group className="mb-3">
                                                <Form.Select value={inputCardWatcher} onChange={(e) => setInputCardWatcher(e.target.value)}>
                                                    {
                                                        inputCardWatcher === "" ? (<option selected={true}> Choose Card Watcher </option>) : (null)
                                                    }
                                                    {
                                                        enableBeCardWatcher.map((cardWatcher) => (
                                                            <option value={cardWatcher.docUserId}>{cardWatcher.username}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Button onClick={() => cancelLinkClicked()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Cancel</Button>{' '}
                                                <Button onClick={() => createCardWatcher()} style={{ marginTop: "10px" }} size="sm" variant="primary">Create</Button>{' '}
                                            </Form.Group>
                                        </Form.Group>
                                    </Form></>
                            )
                            :
                            (null)
                    }

                </>
            )
            :
            (
                <Form style={{ width: "100%" }}>
                    <Form.Label htmlFor='disableSelect'>Card Watcher List</Form.Label>
                    {

                    }
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        {
                            watcherData.map((watcherData, i) => (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", marginBottom: "10px" }}>
                                    <Form.Label htmlFor='disableSelect'> {i + 1}. {watcherData.cardWatcherName}</Form.Label>
                                    {
                                        watcherData.userId === UserContext.user.userId ?
                                            (<Button onClick={() => deleteCardWatcher(watcherData.watcherId)} size="sm" variant="dark">Leave</Button>)
                                            :
                                            BoardContext.currentUserBoardRole === 'Admin' ?
                                                (<Button onClick={() => deleteCardWatcher(watcherData.watcherId)} size="sm" variant="danger">Remove</Button>)
                                                :
                                                (null)
                                    }

                                </div>
                            ))
                        }
                    </Form.Group>
                    {
                        BoardContext.currentUserBoardRole === 'Admin' ?
                            (
                                <>
                                    <ToggleButton onClick={() => addLinkClicked()} style={{ width: "100%", display: `${displayCardWatcher}`, justifyContent: "flex-start", alignItems: "center" }} className="mb-2" id="toggle-check" type="checkbox" variant="outline-success" value={realCardDetail.cardId}>
                                        <span style={{ display: "flex", alignItems: "center" }}><AiOutlinePlus></AiOutlinePlus> Add Card Watcher </span>
                                    </ToggleButton>
                                    <Form style={{ width: "100%", display: `${displayInputCardLink}` }}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Group className="mb-3">
                                                <Form.Select value={inputCardWatcher} onChange={(e) => setInputCardWatcher(e.target.value)}>
                                                    {
                                                        inputCardWatcher === "" ? (<option selected={true}> Choose Card Watcher </option>) : (null)
                                                    }
                                                    {
                                                        enableBeCardWatcher.map((cardWatcher) => (
                                                            <option value={cardWatcher.docUserId}>{cardWatcher.username}</option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Button onClick={() => cancelLinkClicked()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Cancel</Button>{' '}
                                                <Button onClick={() => createCardWatcher()} style={{ marginTop: "10px" }} size="sm" variant="primary">Create</Button>{' '}
                                            </Form.Group>
                                        </Form.Group>
                                    </Form></>
                            )
                            :
                            (null)
                    }

                </Form>
            )
    )
}

export default CardWatcher