import { collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Form, Modal, ToggleButton } from 'react-bootstrap'
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { CreateIconButton } from '../../component/leftBar/Button'
import { midStyleBoard } from '../../component/midContent/style/midStyle_css'
import { cardChecklistType, cardType } from '../../model/model'
import { GenerateRandomLink } from '../function/RandomId'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CardDescription from '../../page/content_page/board_page/CardDetail/CardDescription'
import CardLink from '../../page/content_page/board_page/CardDetail/CardLink'
import CardCheckList from '../../page/content_page/board_page/CardDetail/CardCheckList'
import CardLocation from '../../page/content_page/board_page/CardDetail/CardLocation'
import CardComment from '../../page/content_page/board_page/CardDetail/CardComment'
import CardWatcher from '../../page/content_page/board_page/CardDetail/CardWatcher'

const GetBoardCardDetail = ({ cardDataPerList }: { cardDataPerList: cardType }) => {

    const firestore = useFirestore()
    const batch = writeBatch(firestore)
    const [cardDetailPopup, setCardDetailPopup] = useState(false)

    const getCardCollection = collection(firestore, "CardCollection")
    const { status: statusGetCardData, data: dataCard } = useFirestoreCollectionData(
        query(getCardCollection,
        ), {
        idField: 'cardId'
    })

    const getCheclistCardCollection = collection(firestore, `CardCollection/${cardDataPerList.cardId}/CheckLists`)
    const { status: statusGetChecklistCardData, data: dataChecklistCard } = useFirestoreCollectionData(
        query(getCheclistCardCollection,
        ), {
        idField: 'checkListId'
    })


    if (statusGetCardData === 'loading' || statusGetChecklistCardData === 'loading') {
        return (<div>Get data card...</div>)
    }

    const cardData = dataCard as Array<cardType>
    const cardChecklistData = dataChecklistCard as Array<cardChecklistType>

    const cardDetail = cardData.filter((cardData) => {
        if (cardData.cardId === cardDataPerList.cardId) {
            return cardData
        }
    })

    const detailCard = async (cardId: string) => {
        setCardDetailPopup(true)
    }

    const realCardDetail = cardDetail[0]
    realCardDetail.cardCheckList = cardChecklistData

    const deleteCard = async () => {

        //delete list
        deleteDoc(doc(firestore, `ListCollection/${realCardDetail.listId}/Cards/`, realCardDetail.cardId));

        //delete card 
        deleteDoc(doc(firestore, `CardCollection`, realCardDetail.cardId));

    }


    console.log(realCardDetail)

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
                            <CardDescription realCardDetail={realCardDetail}></CardDescription>
                        }{
                            <CardLink realCardDetail={realCardDetail}></CardLink>
                        }{
                            <CardCheckList realCardDetail={realCardDetail}></CardCheckList>
                        }{
                            <CardLocation realCardDetail={realCardDetail}></CardLocation>  
                        }{
                            <CardWatcher realCardDetail={realCardDetail}></CardWatcher>
                        }{
                            <CardComment realCardDetail={realCardDetail}></CardComment>
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