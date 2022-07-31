import { collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Form, Modal, ToggleButton } from 'react-bootstrap'
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { CreateIconButton } from '../../component/leftBar/Button'
import { midStyleBoard } from '../../component/midContent/style/midStyle_css'
import { cardType } from '../../model/model'

const GetBoardCardDetail = ({ cardDataPerList }: { cardDataPerList: cardType }) => {

    const [cardDetailPopup, setCardDetailPopup] = useState(false)
    const [cardDescription, setCardDescription] = useState("")
    const [displayCardDescription, setDisplayCardDescription] = useState("flex")
    const [displayInputCardDescription, setDisplayInputCardDescription] = useState("none")



    const firestore = useFirestore()
    const batch = writeBatch(firestore)

    const getCardCollection = collection(firestore, "CardCollection")
    const { status: statusGetCardData, data: dataCard } = useFirestoreCollectionData(
        query(getCardCollection,
        ), {
        idField: 'cardId'
    })

    if (statusGetCardData === 'loading') {
        return (<div>Get data card...</div>)
    }

    const cardData = dataCard as Array<cardType>

    const cardDetail = cardData.filter((cardData) => {
        if (cardData.cardId === cardDataPerList.cardId) {
            return cardData
        }
    })

    const detailCard = async (cardId: string) => {
        setCardDetailPopup(true)
        setCardDescription(realCardDetail.cardDesc)
    }

    const realCardDetail = cardDetail[0]

    const addDescriptionClicked = () => {
        setDisplayCardDescription("none")
        setDisplayInputCardDescription("block")
        setCardDescription("")
    }

    const cancelDescriptionClicked = () => {
        setDisplayCardDescription("flex")
        setDisplayInputCardDescription("none")
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

    const deleteCard = async () => {

        //delete list
        deleteDoc(doc(firestore, `ListCollection/${realCardDetail.listId}/Cards/`, realCardDetail.cardId));

        //delete card 
        deleteDoc(doc(firestore, `CardCollection`, realCardDetail.cardId));

    }

    return (
        <>
            <button style={midStyleBoard.cardContainer} onClick={() => detailCard(cardDataPerList.cardId as string)}>
                <p>{cardDataPerList.cardName}</p>
            </button>
            <Modal
                show={cardDetailPopup}
                onHide={() => setCardDetailPopup(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Card Detail
                    </Modal.Title>
                    <CreateIconButton icon={<AiTwotoneDelete size={25} color="black" />} onClickFunction={deleteCard} ></CreateIconButton>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <p style={{ display: "flex", width: "100%", justifyContent: "center", fontSize: "24px" }}>{realCardDetail.cardName}</p>
                        {
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
                        }
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCardDetailPopup(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default GetBoardCardDetail