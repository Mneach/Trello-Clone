import { collection, doc, query, setDoc, Timestamp, where } from 'firebase/firestore'
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
import { WorkspaceInviteLinkType, WorkspaceType } from '../../../model/model'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'

const WorkspaceInvitationError = () => {
    return (
        <div>
            <NavbarContentPage />
            <GeneralContentContainer>
                <LeftBarContainer>
                    <LeftBarContentPage />
                </LeftBarContainer>
                <MidContainer isDetailPage={false}>
                    <MidContentContainer>
                        <MidContentTitle titleName={" LINK INVALID "} data={false}></MidContentTitle>
                    </MidContentContainer>
                </MidContainer>
                <RightBarContainer>
                    <RightBarContentPage />
                </RightBarContainer>
            </GeneralContentContainer>
        </div >
    )
}

export default WorkspaceInvitationError