import { addDoc, collection, deleteDoc, doc, Firestore, query, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Form, Modal, ToggleButton } from 'react-bootstrap'
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { CreateIconButton } from '../../component/leftBar/Button'
import { MidListContainer, MidListTitleContainer } from '../../component/midContent/MidContainer'
import { midStyleBoard } from '../../component/midContent/style/midStyle_css'
import { useBoardContext } from '../../context/BoardContext'
import { useUserContext } from '../../context/UserContext'
import { cardType, listType } from '../../model/model'
import { db } from '../firebase/config'
import GetBoardCardDetail from './GetBoardCardDetail'

interface boardContentType {
    listData: listType,
}

const GetBoardContentData = ({ listData }: boardContentType) => {
    const UserContext = useUserContext()
    const BoardContext = useBoardContext()
    const [displayAddCard, setDisplayAddCard] = useState("flex")
    const [displayInputCard, setDisplayInputCard] = useState("none")

    const [cardName, setCardName] = useState("")

    const firestore = useFirestore()

    const [cardDetailPopup, setCardDetailPopup] = useState(false)


    const getCardCollection = collection(firestore, "CardCollection")
    const { status: statusGetCardData, data: dataCard } = useFirestoreCollectionData(
        query(getCardCollection,
        ), {
        idField: 'cardId'
    })

    const getCardCollectionPerList = collection(firestore, `ListCollection/${listData.listId}/Cards`)
    const { status: statusGetCardDataPerList, data: dataCardPerList } = useFirestoreCollectionData(
        query(getCardCollectionPerList,
        ), {
        idField: 'listId'
    })
    

    if (statusGetCardData === 'loading' || statusGetCardDataPerList === 'loading') {
        return (<div>Get card data...</div>)
    }

    const cardData = dataCard as Array<cardType>
    const cardDataPerList = dataCardPerList as Array<cardType>

    const addCardClicked = () => {
        setDisplayAddCard("none")
        setDisplayInputCard("block")
        setCardName("")
    }

    const cancelCardClicked = () => {
        setDisplayAddCard("flex")
        setDisplayInputCard("none")
        setCardName("")
    }

    const deleteList = async () => {

        
        for (let i = 0; i < cardDataPerList.length; i++) {
            const element = cardDataPerList[i];
            //delete card in list
            deleteDoc(doc(firestore, `ListCollection/${listData.listId}/Cards/`, element.cardId));
            
            //delete card 
            deleteDoc(doc(firestore, `CardCollection`, element.cardId));
        }

        //delete list in board
        deleteDoc(doc(firestore, `BoardCollection/${BoardContext.board.boardId}/Lists/`, listData.listId));

        //delete list 
        deleteDoc(doc(firestore , `ListCollection` , listData.listId))
    }

    const createCard = async (listId: string) => {
        const cardRef = await addDoc(collection(db, 'CardCollection'), {
            cardName: cardName,
            listId: listId,
            cardDesc: "",
            cardLink: "",
            cardLatitude  : -6.200110703081585,
            cardLongitude : 106.78388834110297,
            boardId : BoardContext.board.boardId,
            workspaceId : BoardContext.board.boardWorkspaceId
        })

        await setDoc(doc(db, `ListCollection/${listId}/Cards`, cardRef.id as string), {
            cardId: cardRef.id,
            cardName: cardName
        })

        const cardWatcher = await addDoc(collection(db, 'CardWatcher'), {
            userId : UserContext.user.userId,
            cardId : cardRef.id,
            cardWatcherName : UserContext.user.username
        })

        cancelCardClicked()
    }

    const detailCard = async (cardId: string) => {
        setCardDetailPopup(true)
    }

    return (
        <div>
            <MidListContainer key={listData.listId}>
                <MidListTitleContainer>
                    <span>{listData.listName}</span>
                    <CreateIconButton icon={<AiTwotoneDelete size={25} />} onClickFunction={deleteList} ></CreateIconButton>
                </MidListTitleContainer>
                <ToggleButton onClick={() => addCardClicked()} style={{ width: "90%", display: `${displayAddCard}`, justifyContent: "flex-start", alignItems: "center" }} className="mb-2" id="toggle-check" type="checkbox" variant="outline-light" value="1">
                    <span style={{ display: "flex", alignItems: "center" }}><AiOutlinePlus></AiOutlinePlus> Add Card</span>
                </ToggleButton>
                <Form style={{ width: "90%", display: `${displayInputCard}` }}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Control type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Enter a name for this card" />
                        <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                            <Button onClick={() => cancelCardClicked()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Cancel</Button>{' '}
                            <Button onClick={() => createCard(listData.listId)} style={{ marginTop: "10px" }} size="sm" variant="primary">Create</Button>{' '}
                        </Form.Group>
                    </Form.Group>
                </Form>
                {
                    Array.isArray(cardDataPerList) && !cardDataPerList.length ?
                        (null)
                        :
                        (

                            cardDataPerList.map((cardDataPerList) => (
                                <GetBoardCardDetail cardDataPerList={cardDataPerList} />
                            ))
                        )
                }


            </MidListContainer>

        </div>
    )
}

export default GetBoardContentData