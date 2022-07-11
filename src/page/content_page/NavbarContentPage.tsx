import { FiSettings, FiActivity } from 'react-icons/fi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { GoSignOut } from 'react-icons/go'
import React, { MouseEventHandler, useState } from 'react'
import { auth , db } from '../../firebase/config'
import { Link, useNavigate } from 'react-router-dom'
import './NavbarContentPage__css.css'
import { AiOutlineUser } from 'react-icons/ai'


const NavbarContentPage = () => {
 
  const navigate = useNavigate()
  
  const signOut: MouseEventHandler<HTMLButtonElement> = async (e) => {
    await auth.signOut()
    navigate('/')
  }
  
  return (
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
            <button className="button__icon">
              <IoNotificationsOutline />
            </button>
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
  )
}

export default NavbarContentPage