import { collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Form, Modal, ToggleButton } from 'react-bootstrap'
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { CreateIconButton } from '../../../../component/leftBar/Button'
import { midStyleBoard } from '../../../../component/midContent/style/midStyle_css'
import { cardChecklistType, cardType } from '../../../../model/model'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GenerateRandomLink } from '../../../../lib/function/RandomId'

const CardLink = ({ realCardDetail }: { realCardDetail: cardType }) => {

    const firestore = useFirestore()
    const batch = writeBatch(firestore)

    
    const [cardLink, setCardLink] = useState(realCardDetail.cardLink)
    const [displayCardLink, setDisplayCardLink] = useState("flex")
    const [displayInputCardLink, setDisplayInputCardLink] = useState("none")
    const [isCopied, setIsCopied] = useState(false);

    
    const addLinkClicked = () => {
        setDisplayCardLink("none")
        setDisplayInputCardLink("block")
        regenerateLink()
    }

    const cancelLinkClicked = () => {
        setDisplayCardLink("flex")
        setDisplayInputCardLink("none")
    }

    const regenerateLink = async () => {

        const link = GenerateRandomLink(15, "CAEfTe221")
        const refUser = doc(firestore, `CardCollection`, realCardDetail.cardId)
        batch.update(refUser, {
            cardLink: link
        })

        await batch.commit()
        setCardLink(link)
        cancelLinkClicked()
    }

    const deleteLink = async () => {
        const refUser = doc(firestore, `CardCollection`, realCardDetail.cardId)
        batch.update(refUser, {
            cardLink: ""
        })

        await batch.commit()
        cancelLinkClicked()
    }

    async function copyTextToClipboard(text: string) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        }
    }

    const handleCopyClick = () => {
        copyTextToClipboard(cardLink)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    }


    return (
        realCardDetail.cardLink === "" ?
            (
                <>
                    <ToggleButton onClick={() => addLinkClicked()} style={{ width: "100%", display: `${displayCardLink}`, justifyContent: "flex-start", alignItems: "center" }} className="mb-2" id="toggle-check" type="checkbox" variant="outline-success" value={realCardDetail.cardId}>
                        <span style={{ display: "flex", alignItems: "center" }}><AiOutlinePlus></AiOutlinePlus> Create Link </span>
                    </ToggleButton>
                    <Form style={{ width: "100%", display: `${displayInputCardLink}` }}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control type="text" value={cardLink} onChange={(e) => setCardLink(e.target.value)} placeholder="Enter Description" />
                            <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                <Button onClick={() => deleteLink()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Delete</Button>{' '}
                                <Button onClick={() => regenerateLink()} style={{ marginTop: "10px" }} size="sm" variant="primary">Regenerate Link</Button>{' '}
                            </Form.Group>
                        </Form.Group>
                    </Form>
                </>
            )
            :
            (
                <Form style={{ width: "100%" }}>
                    <Form.Label htmlFor='disableSelect'>Card Link</Form.Label>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Control type="text" value={cardLink} disabled />
                        <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                            <Button onClick={() => deleteLink()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Delete</Button>{' '}
                            <Button onClick={() => regenerateLink()} style={{ marginTop: "10px" }} size="sm" variant="primary">Regenerate Link</Button>{' '}
                            <Button onClick={() => handleCopyClick()} style={{ marginTop: "10px" }} size="sm" variant="success">Copy Link</Button>{' '}
                        </Form.Group>
                    </Form.Group>
                </Form>
            )
    )
}

export default CardLink