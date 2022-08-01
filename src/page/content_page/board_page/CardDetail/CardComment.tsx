import { addDoc, collection, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Form, Modal, ToggleButton } from 'react-bootstrap'
import { AiOutlinePlus, AiTwotoneDelete } from 'react-icons/ai'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { CreateIconButton } from '../../../../component/leftBar/Button'
import { midStyleBoard } from '../../../../component/midContent/style/midStyle_css'
import { useUserContext } from '../../../../context/UserContext'
import { db } from '../../../../lib/firebase/config'
import { BoardMember, BoardType, cardChecklistType, cardCommentType, cardType, WorkspaceMember } from '../../../../model/model'
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";
import { useBoardContext } from '../../../../context/BoardContext'
import { union, uniqBy } from 'lodash'

const CardComment = ({ realCardDetail }: { realCardDetail: cardType }) => {

    const firestore = useFirestore()
    const batch = writeBatch(firestore)
    const userContext = useUserContext()
    const boardContext = useBoardContext()

    const [cardComment, setCardComment] = useState(realCardDetail.cardDesc)
    const [displayCardComment, setDisplayCardComment] = useState("flex")
    const [displayInputCardComment, setDisplayInputCardComment] = useState("none")


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

    const getWorkspaceCollection = collection(firestore , `WorkspaceCollection/${boardContext.board.boardWorkspaceId}/members`)
    const { status: statusGetWorkspaceData, data: dataWorkspace } = useFirestoreCollectionData(
        query(getWorkspaceCollection,
        ), {
        idField: 'docUserId'
    })


    if (statusGetCardData === 'loading' || stateGetaBoardData === 'loading' || statusGetWorkspaceData === 'loading') {
        return (<div>get comment data</div>)
    }

    const commentData = (dataCard as Array<cardCommentType>)
    const boardMemberData = dataBoardMember as Array<BoardMember>
    const workspaceMemberData = dataWorkspace as Array<WorkspaceMember>

    console.log(workspaceMemberData)

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
    let dataMention : SuggestionDataItem[] = []

    if(boardContext.board.boardVisibility === "Private"){
        dataMention = boardMemberDataSearch
    }else{
        dataMention = uniqBy(union((boardMemberDataSearch), (workspaceMemberDataSearch)), 'id')
    }

    console.log(dataMention)

    const dataMentionSearch = dataMention.filter((dataMention) => {
        if(dataMention.id !== userContext.user.userId){
            return dataMention
        }
    })

    console.log(dataMentionSearch)

    const addDescriptionClicked = () => {
        setDisplayCardComment("none")
        setDisplayInputCardComment("block")
        setCardComment("")
    }

    const createComment = async () => {

        await addDoc(collection(db, `CommentCollection`), {
            comment: cardComment,
            cardId: realCardDetail.cardId,
            userId: userContext.user.userId,
            userEmail: userContext.user.email
        })

        await batch.commit()
        setCardComment("")
    }

    const deleteComment = async (commentId: string) => {

        await deleteDoc(doc(db, `CommentCollection/${commentId}`))
    }

    const cancelDescriptionClicked = () => {
        setDisplayCardComment("flex")
        setDisplayInputCardComment("none")
        setCardComment("")
    }
    function handleCreateComment(event : any, newValue : any, newPlainTextValue : any, mentions : any) {
        // console.log(event)
        // console.log(newValue)
        console.log(newPlainTextValue)
        console.log(mentions)
        setCardComment(newPlainTextValue)
    }   

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
                            {

                            }
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
                                                    <Button onClick={() => deleteComment(comment.commentId)} size="sm" variant="info">Reply</Button>{' '}
                                                </Form.Group>
                                            </div>
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
                                        <Mention trigger="@" data={dataMentionSearch as SuggestionDataItem[]} />
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