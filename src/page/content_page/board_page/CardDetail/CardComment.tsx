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
import CardReplyComment from './CardReplyComment'

const CardComment = ({ realCardDetail }: { realCardDetail: cardType }) => {

    const firestore = useFirestore()
    const batch = writeBatch(firestore)
    const userContext = useUserContext()
    const boardContext = useBoardContext()

    const [cardComment, setCardComment] = useState(realCardDetail.cardDesc)
    const [displayCardComment, setDisplayCardComment] = useState("flex")
    const [displayInputCardComment, setDisplayInputCardComment] = useState("none")

    const [mentionArr, setMentionArr] = useState<reactMentionsType[]>([{id : "" , display : ""}])


    const getCardCollection = collection(firestore, "CommentCollection")
    const { status: statusGetCardData, data: dataCard } = useFirestoreCollectionData(
        query(getCardCollection, where("cardId", "==", realCardDetail.cardId)
        ), {
        idField: 'commentId'
    })

    const getBoardCollection = collection(firestore, `BoardCollection/${boardContext.board.boardId}/members`)
    const { status: stateGetaBoardData, data: dataBoardMember } = useFirestoreCollectionData(
        query(getBoardCollection,
        ), {
        idField: 'docUserId'
    })

    const getWorkspaceCollection = collection(firestore, `WorkspaceCollection/${boardContext.board.boardWorkspaceId}/members`)
    const { status: statusGetWorkspaceData, data: dataWorkspace } = useFirestoreCollectionData(
        query(getWorkspaceCollection,
        ), {
        idField: 'docUserId'
    })

    const getCommentReplyQuery = collection(firestore, "ReplyCollection")
    const { status: statusCommentReplyData, data: dataReply } = useFirestoreCollectionData(
        query(getCommentReplyQuery,
        ), {
        idField: 'replyId'
    })


    const getUserCollection = collection(firestore, `UserCollection`)
    const { status: statusGetUserData, data: dataUser } = useFirestoreCollectionData(
        query(getUserCollection,
        ), {
        idField: 'docUserId'
    })

    const getCardWatcherCollection = collection(firestore, "CardWatcher")
    const { status: statusGetCardWatcherData, data: dataWacher } = useFirestoreCollectionData(
        query(getCardWatcherCollection, where("cardId", "==", realCardDetail.cardId)
        ), {
        idField: 'watcherId'
    })

    if (statusGetCardWatcherData === 'loading' || statusCommentReplyData === 'loading' || statusGetUserData === 'loading' || statusGetCardData === 'loading' || stateGetaBoardData === 'loading' || statusGetWorkspaceData === 'loading') {
        return (<div>get comment data</div>)
    }

    let commentData = (dataCard as Array<cardCommentType>)
    let boardMemberData = dataBoardMember as Array<BoardMember>
    let workspaceMemberData = dataWorkspace as Array<WorkspaceMember>
    let userData = dataUser as Array<UserType>
    let replyData = dataReply as Array<replyType>
    let watcherData = dataWacher as Array<cardWathcerType>

    const filterDataWokrspace = workspaceMemberData.map((workspaceMemberData) => {
        return {
            id: workspaceMemberData.docUserId,
            display: workspaceMemberData.email,
            email: workspaceMemberData.email
        }
    })

    const filterDataAccordingToReactMention = boardMemberData.map((boardMemberData) => {
        return {
            id: boardMemberData.docUserId,
            display: boardMemberData.email,
            email: boardMemberData.email
        }
    })

    const boardMemberDataSearch = filterDataAccordingToReactMention as unknown as SuggestionDataItem[]
    const workspaceMemberDataSearch = filterDataWokrspace as unknown as SuggestionDataItem[]
    let dataMention: SuggestionDataItem[] = []

    if (boardContext.board.boardVisibility === "Private") {
        dataMention = boardMemberDataSearch
    } else {
        dataMention = uniqBy(union((boardMemberDataSearch), (workspaceMemberDataSearch)), 'id')
    }

    
    let dataMentionSearch = dataMention.filter((dataMention) => {
        if (dataMention.id !== userContext.user.userId) {
            return dataMention
        }
    })
    
    console.log(dataMentionSearch)
    let resultSearchMention: SuggestionDataItem[] = []
    for (let i = 0; i < dataMentionSearch.length; i++) {
        const datamention = dataMentionSearch[i];
        for (let i = 0; i < userData.length; i++) {
            const datauser = userData[i];
            if (datamention.id === datauser.userId && datauser.privacySetting == "On") {
                resultSearchMention.push(datamention)
            }
        }
    }

    const addDescriptionClicked = () => {
        setDisplayCardComment("none")
        setDisplayInputCardComment("block")
        setCardComment("")
    }

    const cancelDescriptionClicked = () => {
        setDisplayCardComment("flex")
        setDisplayInputCardComment("none")
        setCardComment("")
    }


    const createComment = async () => {

        await addDoc(collection(db, `CommentCollection`), {
            comment: cardComment,
            cardId: realCardDetail.cardId,
            userId: userContext.user.userId,
            userEmail: userContext.user.email
        })

        for (let index = 0; index < mentionArr.length; index++) {
            if(index === 0) continue
            const element = mentionArr[index];
            if(cardComment.includes(element.display)){
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
        setCardComment("")
    }

    const deleteComment = async (commentId: string) => {

        const replayDeleteData = replyData.filter((replyData) => {
            if (replyData.commentId === commentId) {
                return replyData
            }
        })

        for (let index = 0; index < replayDeleteData.length; index++) {
            const element = replayDeleteData[index];
            await deleteDoc(doc(db, `ReplyCollection/${element.replyId}`))
        }

        await deleteDoc(doc(db, `CommentCollection/${commentId}`))
    }

    function handleCreateComment(event: any, newValue: any, newPlainTextValue: any, mentions: Array<reactMentionsType>) {
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
        setCardComment(newPlainTextValue)
    }

    console.log(mentionArr)

    return (
        <div>
            {
                Array.isArray(commentData) && !commentData.length ?
                    (
                        <>
                            <ToggleButton onClick={() => addDescriptionClicked()} style={{ width: "100%", display: `${displayCardComment}`, justifyContent: "flex-start", alignItems: "center" }} className="mb-2" id="toggle-check" type="checkbox" variant="outline-success" value={realCardDetail.cardId}>
                                <span style={{ display: "flex", alignItems: "center" }}><AiOutlinePlus></AiOutlinePlus> Add Comment</span>
                            </ToggleButton>
                            <Form style={{ width: "100%", display: `${displayInputCardComment}` }}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Control type="text" value={cardComment} onChange={(e) => setCardComment(e.target.value)} placeholder="Enter Comment" />
                                    <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Button onClick={() => cancelDescriptionClicked()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Cancel</Button>{' '}
                                        <Button onClick={() => createComment()} style={{ marginTop: "10px" }} size="sm" variant="primary">Create</Button>{' '}
                                    </Form.Group>
                                </Form.Group>
                            </Form>
                        </>
                    )
                    :
                    (
                        <Form style={{ width: "100%" }}>
                            <Form.Label htmlFor='disableSelect'>Card Comment</Form.Label>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                {
                                    commentData.map((comment) => (
                                        <>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", marginBottom: "10px" }}>
                                                <Form.Label htmlFor='disableSelect'><b>{comment.userEmail}</b> <br /> {comment.comment}</Form.Label>
                                                <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                                    {
                                                        userContext.user.userId === comment.userId ?
                                                            (<Button onClick={() => deleteComment(comment.commentId)} size="sm" variant="danger">Delete</Button>)
                                                            :
                                                            (null)
                                                    }
                                                </Form.Group>
                                            </div>
                                            <CardReplyComment commentData={comment} realCardDetail={realCardDetail} resultSearchMention={resultSearchMention}></CardReplyComment>
                                        </>
                                    ))
                                }

                            </Form.Group>
                            <ToggleButton onClick={() => addDescriptionClicked()} style={{ width: "100%", display: `${displayCardComment}`, justifyContent: "flex-start", alignItems: "center" }} className="mb-2" id="toggle-check" type="checkbox" variant="outline-success" value={realCardDetail.cardId}>
                                <span style={{ display: "flex", alignItems: "center" }}><AiOutlinePlus></AiOutlinePlus> Add Comment</span>
                            </ToggleButton>
                            <Form style={{ width: "100%", display: `${displayInputCardComment}` }}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <MentionsInput className="rounded p-2 w-full bg-blue-200 placeholder-white"
                                        // markup=""
                                        onChange={handleCreateComment}
                                        value={cardComment}
                                        placeholder="Enter Comment"
                                    >
                                        <Mention trigger="@" data={resultSearchMention as SuggestionDataItem[]} />
                                    </MentionsInput>
                                    <Form.Group style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }} className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Button onClick={() => cancelDescriptionClicked()} style={{ marginTop: "10px" }} size="sm" variant="secondary">Cancel</Button>{' '}
                                        <Button onClick={() => createComment()} style={{ marginTop: "10px" }} size="sm" variant="primary">Create</Button>{' '}
                                    </Form.Group>
                                </Form.Group>
                            </Form>

                        </Form>
                    )
            }
        </div>
    )
}

export default CardComment