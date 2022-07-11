import React from 'react'
import { useUserContext } from '../../context/UserContext'
import dummyPhoto from '../../photo/dummy.png';
import './RightBarContentPage__css.css'

const RightBarContentPage = () => {

  const UserContext = useUserContext()
  return (
    <div>
          <div className="user__profile">
            {
              UserContext.user.imageLink?
              (
                <img src={UserContext.user.imageLink} />
              )
              :
              (
                <img src={dummyPhoto} alt="" />
              )
            }
          </div>
          <div className="user__username">
            {UserContext.user.username}
          </div>
          <div className="user__email">
            {UserContext.user.email}
          </div>
    </div>
  )
}

export default RightBarContentPage