import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/firebase/config'
import LandingPageNavbar from './LandingPageNavbar'
import '../../css/landingStyle/Login__css.css'

const Login = () => {

  const[email , setEmail] = useState('')
  const[password , setPassword] = useState('');
  const navigate = useNavigate()

  const loginHandle = async () => {
    try {
      await signInWithEmailAndPassword(auth , email , password)
      navigate('/ContentPage/')
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div>
      <LandingPageNavbar />
      <div className="login__content__container">
        <div className="login__border">
          <div className="title__login">
            <p>login</p>
          </div>
          <div className="form__login">
            <form action="" />
            <div className="login__input__container">
              
              <div className="login__input__email">
                <label htmlFor="email">Email</label><br />
                <input className="input__email" value={email} onChange = {(e) => setEmail(e.target.value)} id="email" type="text" placeholder="Your Email *" />
              </div>

              <div className="login__input__password">
                <label htmlFor="password">Password</label> <br />
                <input className="input__password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="Your Password *" />
              </div>

              <input className="login__input__submit" id="submit-login" type="submit" onClick={loginHandle}></input>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login