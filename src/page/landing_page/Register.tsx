import { createUserWithEmailAndPassword} from "firebase/auth";
import { addDoc, collection, doc, setDoc} from "firebase/firestore";
import { useEffect, useState} from "react";
import { auth, db } from "../../firebase/config";
import { UserType } from "../../model/model";
import { useNavigate } from 'react-router-dom'
import LandingPageNavbar from './LandingPageNavbar'
import './styles/Register__css.css'
import { useAuth, useFirestore } from "reactfire";

const Register = () => {

  const authFromReactFire = useAuth()
  const [username , setUsername] = useState("")
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const firestore = useFirestore()
  const navigate = useNavigate()

const register = async () => {
  try {
    await createUserWithEmailAndPassword(authFromReactFire , email , password)
    await setDoc(doc(db , "UserCollection" , auth.currentUser?.uid as string) , {
      userId : auth.currentUser?.uid as string,
      username : username,
      password : password,
      email : email,
      privacySetting : 'On',
      notificationFrequency : 'Instant',
      imageLink : '',
    } as UserType)

    navigate('/ContentPage/')
  } catch (error) {
    alert(error)
  }
}

  return (
    <div>
      <LandingPageNavbar />
      <div className="register__content__container">
        <div className="register__border">
          <div className="title__register">
            <p>REGISTER</p>
          </div>
          <div className="form__register">
            <form action="" />
            <div className="register__input__container">
              <div className="register__input__name">
                <label htmlFor="name">USERNAME</label> <br />
                <input className="input__name" value = {username} onChange ={(e) => setUsername(e.target.value)} type="text" id="name" name="firstname" placeholder="Your Username *" />
              </div>

              <div className="register__input__email">
                <label htmlFor="email">Email</label><br />
                <input className="input__email" value={email} onChange = {(e) => setEmail(e.target.value)} id="email" type="text" placeholder="Your Email *" />
              </div>

              <div className="register__input__password">
                <label htmlFor="password">Password</label> <br />
                <input className="input__password" value={password} onChange = {(e) => setPassword(e.target.value)} id="password" type="password" placeholder="Your Password *" />
              </div>

              <input className="register__input__submit" id="submit-register" type="submit" onClick={() => register()}></input>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register