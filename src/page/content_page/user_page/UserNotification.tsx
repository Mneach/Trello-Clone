import React from 'react'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import RightBarContentPage from '../RightBarContentPage'
import GetBoardDataHome from '../../../lib/getData/GetBoardDataHome'
import '../../../css/homeStyle/Home__css.css'
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer'
import { GeneralContentContainer } from '../../../component/general/GeneralContainer'
import { RightBarContainer } from '../../../component/rightBar/RightContainer'
import GetCloseBoardHome from '../../../lib/getData/GetClosedBoardHome'
import { useUserContext } from '../../../context/UserContext'
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { BoardHomeType, BoardType, mentionNotificationType, watcherNotifcationType, workspaceNotificaionType } from '../../../model/model'
import { union, uniqBy } from 'lodash'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { FiSettings, FiActivity } from 'react-icons/fi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { GoSignOut } from 'react-icons/go'
import { MouseEventHandler, useState } from 'react'
import { auth, db } from '../../../lib/firebase/config'
import { Link, useNavigate } from 'react-router-dom'
import '../../../css/navbarStyle/NavbarContentPage__css.css'
import { AiOutlineUser } from 'react-icons/ai'
import { MidContainer, MidContentContainer, MidNotificationContent, MidNotificationContentContainer, MidNotificationTitle, MidWorkspaceActionContainer, MidWorkspaceContainer, MidWorkspaceContentContainer, MidWorkspaceContentLeftContainer, MidWorkspaceContentRightContainer, MidWorkspaceTableContainer } from '../../../component/midContent/MidContainer'
import { MidContentTitle, MidWorksapceLeftContent, MidWorkspaceContent, MidWorkspaceRoleName } from '../../../component/midContent/MidContent'



const UserNotification = () => {

  const UserContext = useUserContext()
  const firestore = useFirestore()
  const navigate = useNavigate()

  //=== Get Board From Firestore ===

  const getWokrspaceInvitation = collection(firestore, `WorkspaceNotification`)
  const { status: statusWorkspaceInvitation, data: wokrspaceNotificationData } = useFirestoreCollectionData(
    query(getWokrspaceInvitation), {
    idField: 'workspaceNotificaionId'
  })

  const getMentionNotification = collection(firestore, `CardMentionNotification`)
  const { status: statusMentionNotification, data: mentionNotificationData } = useFirestoreCollectionData(
    query(getMentionNotification, where("userEmail", "==", UserContext.user.email)), {
    idField: 'mentionNotificationId'
  })

  const cardWatcherQuery = collection(firestore, `CardWatcherNotification`)
  const { status: statusCardWatcherData, data: cardWatcherNotification } = useFirestoreCollectionData(
    query(cardWatcherQuery, where("userMentionedId", "==", UserContext.user.userId)), {
    idField: 'mentionNotificationId'
  })


  if (statusWorkspaceInvitation === 'loading' || statusMentionNotification === 'loading' || statusCardWatcherData === 'loading') {
    return (<div>Getting Board Data....</div>)
  }

  const dataWorkspaceNotificaiton = wokrspaceNotificationData as Array<workspaceNotificaionType>
  const dataMentionNotification = mentionNotificationData as Array<mentionNotificationType>
  const dataWatcherNotification = cardWatcherNotification as Array<watcherNotifcationType>

  console.log(dataMentionNotification)

  const signOut: MouseEventHandler<HTMLButtonElement> = async (e) => {
    await auth.signOut()
    navigate('/')
  }


  return (
    <div>
      <div className='homePage__navbar__container'>
        <div className="homePage__navbar__left">
          <Link to={'/ContentPage/'} className="chello_ahref">
            Chello
          </Link>
        </div>
        <div className="homePage__navbar__mid">
          <input className='homePage__search' placeholder='Search' type="text" />
        </div>
        <div className="homePage__navbar__right">
          <div className="user__activity__icon">
            <button className="button__icon">
              <FiActivity />
            </button>
          </div>
          <div className="user__notification__icon">
            <Link to={'/ContentPage/UserNotification'} >
              <button className="button__icon">
                <IoNotificationsOutline />
              </button>
            </Link>
          </div>
          <div className="user__setting__icon">
            <Link to={'/ContentPage/UserProfile'} >
              <button className="button__icon">
                <AiOutlineUser />
              </button>
            </Link>
          </div>
          <div className="user__signOut__icon">
            <button className='button__icon' onClick={signOut}>
              <GoSignOut />
            </button>
          </div>
        </div>
      </div>
      <GeneralContentContainer>
        <LeftBarContainer>
          <LeftBarContentPage />
        </LeftBarContainer>
        <MidContainer isDetailPage={false}>
          {
            Array.isArray(dataWorkspaceNotificaiton) && !dataWorkspaceNotificaiton.length ?
              (
                null
              )
              :
              (
                <MidContentContainer>
                  <MidContentTitle titleName={"Wokrspace Notification"} data={false}></MidContentTitle>
                  <MidWorkspaceContainer>
                    <MidWorkspaceTableContainer>
                      <MidWorkspaceContentContainer>
                        {
                          dataWorkspaceNotificaiton.map((dataWorkspaceNotificaiton) => (
                            <MidNotificationContentContainer>
                              <MidNotificationTitle>
                                {dataWorkspaceNotificaiton.notificationTitle}
                              </MidNotificationTitle>
                              <MidNotificationContent>
                                {dataWorkspaceNotificaiton.notificationMessage}
                              </MidNotificationContent>
                            </MidNotificationContentContainer>
                          ))
                        }
                      </MidWorkspaceContentContainer>
                    </MidWorkspaceTableContainer>
                  </MidWorkspaceContainer>
                </MidContentContainer>
              )

          }

          {
            Array.isArray(dataMentionNotification) && !dataMentionNotification.length ?
              (
                null
              )
              :
              (
                <MidContentContainer>
                  <MidContentTitle titleName={"Mention Notification"} data={false}></MidContentTitle>
                  <MidWorkspaceContainer>
                    <MidWorkspaceTableContainer>
                      <MidWorkspaceContentContainer>
                        {
                          dataMentionNotification.map((dataMentionNotification) => (
                            <MidNotificationContentContainer>
                              <MidNotificationTitle>
                                {dataMentionNotification.notificationTitle}
                              </MidNotificationTitle>
                              <MidNotificationContent>
                                {dataMentionNotification.notificationMessage}
                              </MidNotificationContent>
                            </MidNotificationContentContainer>
                          ))
                        }
                      </MidWorkspaceContentContainer>
                    </MidWorkspaceTableContainer>
                  </MidWorkspaceContainer>
                </MidContentContainer>
              )

          }
          {
            Array.isArray(dataWatcherNotification) && !dataWatcherNotification.length ?
              (
                null
              )
              :
              (
                <MidContentContainer>
                  <MidContentTitle titleName={"Card Watcher Notification"} data={false}></MidContentTitle>
                  <MidWorkspaceContainer>
                    <MidWorkspaceTableContainer>
                      <MidWorkspaceContentContainer>
                        {
                          dataWatcherNotification.map((dataWatcherNotification) => (
                            <MidNotificationContentContainer>
                              <MidNotificationTitle>
                                {dataWatcherNotification.notificationTitle}
                              </MidNotificationTitle>
                              <MidNotificationContent>
                                {dataWatcherNotification.notificationMessage}
                              </MidNotificationContent>
                            </MidNotificationContentContainer>
                          ))
                        }
                      </MidWorkspaceContentContainer>
                    </MidWorkspaceTableContainer>
                  </MidWorkspaceContainer>
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

export default UserNotification