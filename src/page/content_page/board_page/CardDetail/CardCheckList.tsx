import { addDoc, collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Form, Modal, ProgressBar, ToggleButton } from 'react-bootstrap'
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { CreateIconButton } from '../../../../component/leftBar/Button'
import { midStyleBoard } from '../../../../component/midContent/style/midStyle_css'
import { cardChecklistType, cardType } from '../../../../model/model'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GenerateRandomLink } from '../../../../lib/function/RandomId'
import { db } from '../../../../lib/firebase/config'

const CardCheckList = ({ realCardDetail }: { realCardDetail: cardType }) => {
    const firestore = useFirestore()
    const batch = writeBatch(firestore)

    const [inputCheckList, setInputCheckList] = useState("")
    const [checkList, setCheckList] = useState(realCardDetail.cardCheckList)
    const [displayCardLink, setDisplayCardLink] = useState("flex")
    const [displayInputCardLink, setDisplayInputCardLink] = useState("none")
    const [isCopied, setIsCopied] = useState(false)

    const addLinkClicked = () => {
        setDisplayCardLink("none")
        setDisplayInputCardLink("block")
        setInputCheckList("")
    }

    const cancelLinkClicked = () => {
        setDisplayCardLink("flex")
        setDisplayInputCardLink("none")
        setInputCheckList("")
    }

    const createCheckList = async () => {
        await addDoc(collection(db, `CardCollection/${realCardDetail.cardId}/CheckLists`), {
            cardCheckList: inputCheckList,
            checkListDone: false
        })
        setInputCheckList("")
    }

    const deleteCheckList = async (checkListId: string) => {
        await deleteDoc(doc(db, `CardCollection/${realCardDetail.cardId}/CheckLists/${checkListId}`))
    }

    const updateProgressCheckList = async (checkListId: string, checkListDone: boolean) => {

        if (checkListDone === true) {
            const refCheckList = doc(firestore, `CardCollection/${realCardDetail.cardId}/CheckLists/`, checkListId)
            batch.update(refCheckList, {
                checkListDone: false
            })
        } else {
            const refCheckList = doc(firestore, `CardCollection/${realCardDetail.cardId}/CheckLists/`, checkListId)
            batch.update(refCheckList, {
                checkListDone: true
            })
        }
        await batch.commit()
        console.log("done")
    }

    let totalDone = 0

    for (let i = 0; i < realCardDetail.cardCheckList.length; i++) {
        const element = realCardDetail.cardCheckList[i];
        if (element.checkListDone === true) {
            totalDone++
        }
    }

    const progressPerCheckList = 100 / realCardDetail.cardCheckList.length
    const progressBarValue = Math.ceil(progressPerCheckList) * totalDone

    const progressBarTotal = progressBarValue > 100 ? (100) : (progressBarValue)
    const progressBarLabel = progressBarTotal >= 100 ? ("Completed") : (progressBarTotal + "%")
    // if(progressBarTotal < 30){
    //     setProgressBarVariant("warning")
    // }else if(progressBarTotal >= 30 && progressBarTotal < 60){
    //     setProgressBarVariant("info")
    // }else if(progressBarTotal >= 60 && progressBarTotal <= 99){
    //     setProgressBarVariant("primary")
    // }else {
    //     setProgressBarVariant("success")
    // }

    const progressBarVariant = progressBarTotal < 30 ?
        ("danger")
        : progressBarTotal >= 30 && progressBarTotal < 60 ?
            ("warning")
            : progressBarTotal >= 60 && progressBarTotal <= 99?
                ("primary")
                :
                ("success")

    return (
        Array.isArray(realCardDetail.cardCheckList) && !realCardDetail.cardCheckList.length ?
            (
                <>
                    <ToggleButton onClick={() => addLinkClicked()} style={{ width: "100%", display: `${displayCardLink}`, justifyContent: "flex-start", alignItems: "center" }} className="mb-2" id="toggle-check" type="checkbox" variant="outline-success" value={realCardDetail.cardId}>
                        <span style={{ display: "flex", alignItems: "center" }}><AiOutlinePlus></AiOutlinePlus> Create CheckList </span>
                    </ToggleButton>
                    <Form style={{ width: "100%", display: `${displayInputCardLink}` }}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control type="text" value={inputCheckList} onChange={(e) => setInputCheckList(e.target.value)} placeholder="Add an item " />
                            <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                <Button onClick={() => cancelLinkClicked()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Cancel</Button>{' '}
                                <Button onClick={() => createCheckList()} style={{ marginTop: "10px" }} size="sm" variant="primary">Create</Button>{' '}
                            </Form.Group>
                        </Form.Group>
                    </Form>
                </>
            )
            :
            (
                <Form style={{ width: "100%" }}>
                    <Form.Label htmlFor='disableSelect'>Card CheckList</Form.Label>
                    {

                    }
                    <ProgressBar variant={progressBarVariant} now={progressBarTotal} label={`${progressBarLabel}`} />
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        {
                            realCardDetail.cardCheckList.map((checkList) => (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", marginBottom: "10px" }}>
                                    <Form.Check type="checkbox" checked={checkList.checkListDone} onClick={() => updateProgressCheckList(checkList.checkListId, checkList.checkListDone)} label={checkList.cardCheckList} />
                                    <Button onClick={() => deleteCheckList(checkList.checkListId)} size="sm" variant="danger">Delete</Button>{' '}
                                </div>
                            ))
                        }
                    </Form.Group>
                    <ToggleButton onClick={() => addLinkClicked()} style={{ width: "100%", display: `${displayCardLink}`, justifyContent: "flex-start", alignItems: "center" }} className="mb-2" id="toggle-check" type="checkbox" variant="outline-success" value={realCardDetail.cardId}>
                        <span style={{ display: "flex", alignItems: "center" }}><AiOutlinePlus></AiOutlinePlus> Create CheckList </span>
                    </ToggleButton>
                    <Form style={{ width: "100%", display: `${displayInputCardLink}` }}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control type="text" value={inputCheckList} onChange={(e) => setInputCheckList(e.target.value)} placeholder="Add an item " />
                            <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                <Button onClick={() => cancelLinkClicked()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Cancel</Button>{' '}
                                <Button onClick={() => createCheckList()} style={{ marginTop: "10px" }} size="sm" variant="primary">Create</Button>{' '}
                            </Form.Group>
                        </Form.Group>
                    </Form>
                </Form>
            )
    )
}

export default CardCheckList