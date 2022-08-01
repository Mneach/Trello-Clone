import { collection, doc, Firestore, query, setDoc, Timestamp, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { MidContainer, MidContentContainer, MidContentInputContainer, MidInputContainer } from '../../../component/midContent/MidContainer'
import { MidContentTitle } from '../../../component/midContent/MidContent'
import { SuccessUpdatePopUp } from '../../../component/modal/Modal'
import { RightBarContainer } from '../../../component/rightBar/RightContainer'
import { useUserContext } from '../../../context/UserContext'
import { db } from '../../../lib/firebase/config'
import { BoardInviteLinkType, BoardType, cardType, WorkspaceInviteLinkType, WorkspaceType } from '../../../model/model'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'


const BoardViewCardLink = () => {

    const UserContext = useUserContext()
    const { linkInvitation } = useParams()
    const firestore = useFirestore()
    const navigate = useNavigate()

    const getCardData = collection(firestore, 'CardCollection')
    const { status: statusCardData, data: data } = useFirestoreCollectionData(
        query(getCardData, where("cardLink", "==", linkInvitation)), {
        idField: 'CollectionId'
    })

    if (statusCardData === 'loading') {
        return (<div>getting view card data...</div>)
    }

    const cardData = (data as Array<cardType>)[0]

    console.log(cardData)

    const viewCard = () => {
        navigate(`../../ContentPage/Workspace/${cardData.workspaceId}/Board/${cardData.boardId}` , { replace: true })
    }

    return (
        <div>
            <NavbarContentPage />
            <GeneralContentContainer>
                <LeftBarContainer>
                    <LeftBarContentPage />
                </LeftBarContainer>
                <MidContainer isDetailPage={false}>
                    {
                        Array.isArray(cardData) && !cardData.length ?
                            (
                                <MidContentContainer>
                                    <MidContentTitle titleName={" LINK INVALID "} data={false}></MidContentTitle>
                                </MidContentContainer>
                            )
                            :
                            (
                                <MidContentContainer>
                                    <MidContentTitle titleName={"Click View Button To See [ " + cardData.cardName + " ] Card"} data={false}></MidContentTitle>
                                    <MidContentInputContainer>
                                        <MidInputContainer>
                                            <Button variant="primary" size='lg' onClick={viewCard}>View Card</Button>
                                        </MidInputContainer>
                                    </MidContentInputContainer>
                                </MidContentContainer>
                            )

                    }
                </MidContainer>
                <RightBarContainer>
                    <RightBarContentPage />
                </RightBarContainer>
            </GeneralContentContainer>
        </div>
    )
}

export default BoardViewCardLink