import { collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Form, Modal, ToggleButton } from 'react-bootstrap'
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { CreateIconButton } from '../../../../component/leftBar/Button'
import { midStyleBoard } from '../../../../component/midContent/style/midStyle_css'
import { cardChecklistType, cardType } from '../../../../model/model'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CardDescription = ({ realCardDetail }: { realCardDetail: cardType }) => {

    const firestore = useFirestore()
    const batch = writeBatch(firestore)

    const [cardDescription, setCardDescription] = useState(realCardDetail.cardDesc)
    const [displayCardDescription, setDisplayCardDescription] = useState("flex")
    const [displayInputCardDescription, setDisplayInputCardDescription] = useState("none")
    
    const addDescriptionClicked = () => {
        setDisplayCardDescription("none")
        setDisplayInputCardDescription("block")
        setCardDescription("")
    }
    
    
    const createDesc = async () => {
    
        const refUser = doc(firestore, `CardCollection`, realCardDetail.cardId)
        batch.update(refUser, {
            cardDesc: cardDescription
        })
    
        await batch.commit()
    }
    
    const deleteDesc = async () => {
    
        const refUser = doc(firestore, `CardCollection`, realCardDetail.cardId)
        batch.update(refUser, {
            cardDesc: ""
        })
    
        await batch.commit()
        cancelDescriptionClicked()
    }

    const cancelDescriptionClicked = () => {
        setDisplayCardDescription("flex")
        setDisplayInputCardDescription("none")
        setCardDescription("")
    }

    console.log(cardDescription)

    return (
        realCardDetail.cardDesc === "" ?
            (
                <>
                    <ToggleButton onClick={() => addDescriptionClicked()} style={{ width: "100%", display: `${displayCardDescription}`, justifyContent: "flex-start", alignItems: "center" }} className="mb-2" id="toggle-check" type="checkbox" variant="outline-success" value={realCardDetail.cardId}>
                        <span style={{ display: "flex", alignItems: "center" }}><AiOutlinePlus></AiOutlinePlus> Add Description</span>
                    </ToggleButton>
                    <Form style={{ width: "100%", display: `${displayInputCardDescription}` }}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control type="text" value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} placeholder="Enter Description" />
                            <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                <Button onClick={() => cancelDescriptionClicked()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Cancel</Button>{' '}
                                <Button onClick={() => createDesc()} style={{ marginTop: "10px" }} size="sm" variant="primary">Create</Button>{' '}
                            </Form.Group>
                        </Form.Group>
                    </Form>
                </>
            )
            :
            (
                <Form style={{ width: "100%" }}>
                    <Form.Label htmlFor='disableSelect'>Board Description</Form.Label>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Control type="text" value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} placeholder="Enter a name for this card" />
                        <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                            <Button onClick={() => deleteDesc()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Delete</Button>{' '}
                            <Button onClick={() => createDesc()} style={{ marginTop: "10px" }} size="sm" variant="primary">Edit</Button>{' '}
                        </Form.Group>
                    </Form.Group>
                </Form>
            )
    )
}

export default CardDescription