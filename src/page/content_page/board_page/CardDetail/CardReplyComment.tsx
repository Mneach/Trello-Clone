import { addDoc, collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Form, Modal, ToggleButton } from 'react-bootstrap'
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { CreateIconButton } from '../../../../component/leftBar/Button'
import { midStyleBoard } from '../../../../component/midContent/style/midStyle_css'
import { useUserContext } from '../../../../context/UserContext'
import { db } from '../../../../lib/firebase/config'
import { BoardMember, BoardType, cardChecklistType, cardCommentType, cardType, cardWathcerType, reactMentionsType, replyType, UserType, WorkspaceMember } from '../../../../model/model'
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";
import { useBoardContext } from '../../../../context/BoardContext'
import { union, uniqBy } from 'lodash'

const CardReplyComment = ({ realCardDetail, resultSearchMention, commentData }: { realCardDetail: cardType, resultSearchMention: SuggestionDataItem[], commentData: cardCommentType }) => {

    const firestore = useFirestore()
    const batch = writeBatch(firestore)
    const userContext = useUserContext()
    const boardContext = useBoardContext()
    const [replyComment, setReplyComment] = useState(realCardDetail.cardDesc)
    const [displayReplyComment, setDisplayReplyComment] = useState("flex")
    const [displayInputReplyComment, setDisplayInputReplyComment] = useState("none")
    const [displayReplyButton, setDisplayReplyButotn] = useState("block")
    const [mentionArr, setMentionArr] = useState<reactMentionsType[]>([{id : "" , display : ""}])

    const getCommentReplyQuery = collection(firestore, "ReplyCollection")
    const { status: statusGetCardData, data: dataReply } = useFirestoreCollectionData(
        query(getCommentReplyQuery, where("commentId", "==", commentData.commentId)
        ), {
        idField: 'replyId'
    })

    const getCardWatcherCollection = collection(firestore, "CardWatcher")
    const { status: statusGetCardWatcherData, data: dataWacher } = useFirestoreCollectionData(
        query(getCardWatcherCollection, where("cardId", "==", realCardDetail.cardId)
        ), {
        idField: 'watcherId'
    })

    if (statusGetCardWatcherData === 'loading' || statusGetCardData === 'loading') {
        return (<div>Get Reply... </div>)
    }

    const replyData = dataReply as Array<replyType>
    const watcherData = dataWacher as Array<cardWathcerType>

    const addReplyClicked = () => {
        setDisplayReplyComment("none")
        setDisplayInputReplyComment("block")
        setReplyComment("")
        setDisplayReplyButotn("none")
    }

    const cancelReplyClicked = () => {
        setDisplayReplyComment("flex")
        setDisplayInputReplyComment("none")
        setReplyComment("")
        setDisplayReplyButotn("block")
    }

    function handleReplyComment(event: any, newValue: any, newPlainTextValue: any, mentions: Array<reactMentionsType>) {
  // console.log(event)
        // console.log(newValue)
        console.log(newPlainTextValue)
        console.log(mentions.length)

        if (mentions.length !== 0) {
            mentions.map((metions) => {

                const check = mentionArr?.filter((metionarr) => {
                    if(metionarr.id === metions.id) return metionarr
                })

                if(Array.isArray(check) && !check.length){
                    mentionArr.push(metions)
                }
                
            })
            setMentionArr(mentionArr)
        }
        setReplyComment(newPlainTextValue)
        
    }

    const deleteReply = async (replyId: string) => {

        await deleteDoc(doc(db, `ReplyCollection/${replyId}`))
    }

    const createReply = async () => {

        await addDoc(collection(db, `ReplyCollection`), {
            commentId: commentData.commentId,
            cardId: realCardDetail.cardId,
            userId: userContext.user.userId,
            userEmail: userContext.user.email,
            reply: replyComment,

        })

        for (let index = 0; index < mentionArr.length; index++) {
            if(index === 0) continue
            const element = mentionArr[index];
            if(replyComment.includes(element.display)){
                await addDoc(collection(db, `CardMentionNotification`), {
                    cardId: realCardDetail.cardId,
                    userSend : userContext.user.userId,
                    userMentionedId: element.id,
                    userEmail: element.display,
                    notificationTitle : "You Are Mentioned! ",
                    notificationMessage : `you were mentioned by ${userContext.user.username}  in the card ${realCardDetail.cardName}`
                })
        
            }
        }

        for (let i = 0; i < watcherData.length; i++) {
            const element = watcherData[i];
            await addDoc(collection(db, `CardWatcherNotification`), {
                cardId: realCardDetail.cardId,
                userSend : userContext.user.userId,
                userMentionedId: element.userId,
                notificationTitle : "Someone Commented On Your Card ",
                notificationMessage : `Hello Card Watcher your card was commented by ${userContext.user.username}`
            })
        }

        await batch.commit()
        setReplyComment("")
    }

    return (
        <>
            <Form.Group style={{fontSize : "13px" , marginLeft : "50px"}} className="mb-3" controlId="exampleForm.ControlInput1">
                {
                    replyData.map((replyData) => (
                        <>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", marginBottom: "10px" }}>
                                <Form.Label htmlFor='disableSelect'><b>{replyData.userEmail}</b> <br /> {replyData.reply}</Form.Label>
                                <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                    {
                                        userContext.user.userId === replyData.userId ?
                                            (<Button onClick={() => deleteReply(replyData.replyId)} size="sm" variant="danger">Delete</Button>)
                                            :
                                            (null)
                                    }
                                </Form.Group>
                            </div>
                        </>
                    ))
                }

            </Form.Group>
            <Button size="sm" style={{ display: `${displayReplyButton}` }} onClick={() => addReplyClicked()} variant="info">Reply</Button>{' '}
            <Form style={{ width: "50%", display: `${displayInputReplyComment}` }}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <MentionsInput className="rounded p-2 w-full bg-blue-200 placeholder-white"
                        // markup=""
                        onChange={handleReplyComment}
                        value={replyComment}
                        placeholder="Enter Comment"
                    >
                        <Mention trigger="@" data={resultSearchMention as SuggestionDataItem[]} />
                    </MentionsInput>
                    <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                        <Button onClick={() => cancelReplyClicked()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Cancel</Button>{' '}
                        <Button onClick={() => createReply()} style={{ marginTop: "10px" }} size="sm" variant="primary">Create</Button>{' '}
                    </Form.Group>
                </Form.Group>
            </Form>
        </>

    )
}

export default CardReplyComment