import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useBoardContext } from '../../../context/BoardContext'
import { enumBoardVisibility } from '../../../model/model'
import NavbarContentPage from '../NavbarContentPage'
import LeftBarBoard from './LeftBarBoard'
import './style/Board__css.css'
import './style/BoardSetting__css.css'
import { useFirestore } from 'reactfire'
import { doc, writeBatch } from 'firebase/firestore'
import { useUserContext } from '../../../context/UserContext'

const BoardSetting = () => {

  const UserContext = useUserContext()
  const BoardContext = useBoardContext()
  const [boardTitle, setboardTitle] = useState(BoardContext.board.boardTitle)
  const [boardDescription, setboardDescription] = useState(BoardContext.board.boardDescription)
  const [boardVisibility, setboardVisibiltiy] = useState(BoardContext.board.boardVisibility)
  const firestore = useFirestore()
  const batch = writeBatch(firestore)

  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const handleClose = () => setShowSuccessUpdate(false);
  const handleShow = () => setShowSuccessUpdate(true);

  const updateBoardHandle = async () => {
    const refBoard = doc(firestore, "BoardCollection", BoardContext.board.boardId as string);
    batch.update(refBoard, {
      boardTitle: boardTitle,
      boardVisibility: boardVisibility,
      boardDescription: boardDescription
    })

    const refUser = doc(firestore , `UserCollection/${UserContext.user.userId}/memberBoardOf` , BoardContext.board.boardId as string)
    batch.update(refUser , {
      boardTitle : boardTitle
    })

    await batch.commit();

    handleShow()
  }

  return (
     <div>
      <NavbarContentPage />
      <div className='board__content__container'>
        <LeftBarBoard />
        <div className="board__content__mid__container">
          <div className="board__content__mid">
            <div className="board__title">
              BOARD SETTING
            </div>
            <div className="board__content">
              <div className="board__UpdateProfile__border">
                <div className="form__board">
                  <form action="" />
                  <div className="board__input__container">

                    <div className="board__input__email">
                      <label htmlFor="email">board Title</label><br />
                      {
                        BoardContext.currentUserBoardRole === 'Admin' ?
                          (
                            <input className="input__email" value={boardTitle} onChange={(e) => setboardTitle(e.target.value)} id="email" type="text" placeholder="Your Email *" />
                          )
                          :
                          (
                            <input className="input__email" disabled value={boardTitle} onChange={(e) => setboardTitle(e.target.value)} id="email" type="text" placeholder="Your Email *" />
                          )
                      }
                    </div>

                    <div className="board__input__privacySetting">
                      <label htmlFor='privacySetting'>board Visibility</label> <br />
                      {
                        BoardContext.currentUserBoardRole === 'Admin' ?
                          (
                            <select className='input__privacySetting' value={boardVisibility} onChange={(e) => { setboardVisibiltiy(e.target.value as enumBoardVisibility) }}>
                              {
                                Object.keys(enumBoardVisibility).map((BoardVisibilityData) => {
                                  if (BoardVisibilityData === boardVisibility) {
                                    return (
                                      <option value={BoardVisibilityData} selected>{BoardVisibilityData}</option>
                                    )
                                  } else {
                                    return (
                                      <option value={BoardVisibilityData}>{BoardVisibilityData}</option>
                                    )
                                  }
                                })
                              }
                            </select>

                          )
                          :
                          (
                            <select disabled className='input__privacySetting' value={boardVisibility} onChange={(e) => { setboardVisibiltiy(e.target.value as enumBoardVisibility) }}>
                              {
                                Object.keys(enumBoardVisibility).map((BoardVisibilityData) => {
                                  if (BoardVisibilityData === boardVisibility) {
                                    return (
                                      <option value={BoardVisibilityData} selected>{BoardVisibilityData}</option>
                                    )
                                  } else {
                                    return (
                                      <option value={BoardVisibilityData}>{BoardVisibilityData}</option>
                                    )
                                  }
                                })
                              }
                            </select>
                          )
                      }
                    </div>
                    <label htmlFor="boardDescription">board Description</label>
                    {
                      BoardContext.currentUserBoardRole === 'Admin' ?
                        (
                          <>
                            <textarea value={boardDescription} onChange={(e) => setboardDescription(e.target.value as string)}>

                            </textarea>

                            <input className="board__input__submit" value={"SAVE"} onClick={updateBoardHandle} type="submit"></input>
                          </>
                        )
                        :
                        (
                          <>
                            <textarea disabled value={boardDescription} onChange={(e) => setboardDescription(e.target.value as string)}>
                            </textarea>
                          </>
                        )
                    }
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FOR SUCCESS UPDATE */}

      <Modal
        show={showSuccessUpdate}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Update Success</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>OK</Button>
        </Modal.Footer>
      </Modal>

      {/* END MODAL FOR SUCCESS UPDATE */}
    </div>
  )
}

export default BoardSetting