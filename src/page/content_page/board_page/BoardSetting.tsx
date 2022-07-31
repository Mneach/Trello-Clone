import { useState } from 'react'
import { useBoardContext } from '../../../context/BoardContext'
import { enumBoardVisibility, enumWorkspaceVisibility } from '../../../model/model'
import NavbarContentPage from '../NavbarContentPage'
import '../../../css/boardStyle/Board__css.css'
import { useFirestore } from 'reactfire'
import { doc, writeBatch } from 'firebase/firestore'
import { useUserContext } from '../../../context/UserContext'
import { SuccessUpdatePopUp } from '../../../component/modal/Modal'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { MidContainer, MidContentContainer, MidContentInputContainer, MidInputContainer } from '../../../component/midContent/MidContainer'
import { MidContentTitle } from '../../../component/midContent/MidContent'
import { InputSelectVisibility, InputSubmit, InputText, InputTextArea } from '../../../component/midContent/MidForm'
import LeftBarBoard from './LeftBarBoard'

const BoardSetting = () => {

  const UserContext = useUserContext()
  const BoardContext = useBoardContext()
  const [boardTitle, setboardTitle] = useState(BoardContext.board.boardTitle)
  const [boardDescription, setboardDescription] = useState(BoardContext.board.boardDescription)
  const [boardVisibility, setboardVisibiltiy] = useState<enumWorkspaceVisibility | enumBoardVisibility>(BoardContext.board.boardVisibility)
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

    const refUser = doc(firestore, `UserCollection/${UserContext.user.userId}/memberBoardOf`, BoardContext.board.boardId as string)
    batch.update(refUser, {
      boardTitle: boardTitle
    })

    await batch.commit();

    handleShow()
  }

  return (
    <div>
      <NavbarContentPage />
      <GeneralContentContainer>
        <LeftBarContainer>
          <LeftBarBoard />
        </LeftBarContainer>
        <MidContainer isDetailPage={false}>
          <MidContentContainer>
            <MidContentTitle titleName={" Board Setting "} data={false}></MidContentTitle>
            <MidContentInputContainer>
              <MidInputContainer>
                <label htmlFor="email">Board Title</label>
                {
                  BoardContext.currentUserBoardRole === 'Admin' ?
                    (<InputText type='text' value={boardTitle} setValue={setboardTitle} isDisable={true}></InputText>)
                    :
                    (<InputText type='text' value={boardTitle} setValue={setboardTitle} isDisable={true}></InputText>)
                }

                <label htmlFor='privacySetting'>board Visibility</label>
                {
                  BoardContext.currentUserBoardRole === 'Admin' ?
                    (<InputSelectVisibility value={boardVisibility} setValue={setboardVisibiltiy} isDisable={false} enumType={"board"}></InputSelectVisibility>)
                    :
                    (<InputSelectVisibility value={boardVisibility} setValue={setboardVisibiltiy} isDisable={true} enumType={"board"}></InputSelectVisibility>)
                }

                <label htmlFor="boardDescription">board Description</label>
                {
                  BoardContext.currentUserBoardRole === 'Admin' ?
                    (
                      <>
                        <InputTextArea isDisable={false} value={boardDescription} setValue={setboardDescription}></InputTextArea>
                        <InputSubmit valueName={"SAVE"} onClickFunction={updateBoardHandle}></InputSubmit>
                      </>
                    )
                    : (<InputTextArea isDisable={true} value={boardDescription} setValue={setboardDescription}></InputTextArea>)
                }
              </MidInputContainer>
            </MidContentInputContainer>
          </MidContentContainer>
        </MidContainer>
      </GeneralContentContainer>
      <SuccessUpdatePopUp buttonVariant="Primary" title={"Update Success"} showSuccessUpdate={showSuccessUpdate} setShowSuccessUpdate={setShowSuccessUpdate}></SuccessUpdatePopUp>
    </div >
  )
}

export default BoardSetting