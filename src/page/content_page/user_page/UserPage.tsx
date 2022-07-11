import React, { useContext, useState } from 'react'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import dummyPhoto from '../../../photo/dummy.png';
import './style/UserPage__css.css'
import { useUserContext } from '../../../context/UserContext';
import { enumNotificationFrequency, enumPrivacySetting, UserType } from '../../../model/model';
import { useFirestore } from 'reactfire';
import { doc, writeBatch } from 'firebase/firestore';

import { Modal, Button, Form } from 'react-bootstrap'
import { storage } from '../../../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail, updatePassword, User } from 'firebase/auth';

const UserPage = () => {

    const UserContext = useUserContext()
    const firestore = useFirestore()
    const batch = writeBatch(firestore)
    const auth = getAuth()

    // === USER GETTER SETTER ===

    const [username, setUsername] = useState(UserContext.user.username)
    const [email, setEmail] = useState(UserContext.user.email)
    const [password, setPassword] = useState(UserContext.user.password)
    const [passwordConfirmation , setPasswordConfirmation] = useState('')
    const [notificationFrequency, setNotificationFrequency] = useState(UserContext.user.notificationFrequency)
    const [privacySetting, setPrivacySetting] = useState(UserContext.user.privacySetting)
    const [imageFile, setImageFile] = useState<File>()

    // === END USER GETTER SETTER === 

    // === GETTER SETTER FOR MODAL ===

    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
    const handleClosePasswordConfirmation = () => {
        setShowPasswordConfirmation(false)
        setPasswordConfirmation('')
    }

    const handleShowPasswordConfirmation = () => setShowPasswordConfirmation(true)

    const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
    const handleClose = () => setShowSuccessUpdate(false);
    const handleShow = () => setShowSuccessUpdate(true);

    const [messageModal, setMessageModal] = useState({
        message : '',
        variant : ''
    })

    // === END GETTER SETTER FOR MODAL===

    const updateProfilehandle = async () => {

        let imageUrl = ''
        if(UserContext.user.imageLink !== undefined){
            imageUrl = UserContext.user.imageLink
        }
        
        if(imageFile !== undefined){
            const refStorage = ref(storage, `${UserContext.user.userId}/${(imageFile as File).name}`)
            await uploadBytes(refStorage, imageFile as File, { contentType: 'profile pic' })
            imageUrl = await getDownloadURL(refStorage)
        }

        // if(UserContext.user.email !== email){
        //     const credential = EmailAuthProvider.credential(auth.currentUser?.email as string , UserContext.user.password)
        //     const result = await reauthenticateWithCredential(auth.currentUser as User , credential)

        //     updateEmail(auth.currentUser as User , email).then(() => {
        //     }).catch((error) => {
        //         alert(error)
        //     })

        // }

        // if(UserContext.user.password !== password){
        //     const credential = EmailAuthProvider.credential(auth.currentUser?.email as string , UserContext.user.password)
        //     const result = await reauthenticateWithCredential(auth.currentUser as User , credential)

        //     updatePassword(auth.currentUser as User , password).then(() => {            
        //     }).catch((error) => {
        //         alert(error)
        //     })
        // }
        
        
        const refUser = doc(firestore, "UserCollection", UserContext.user.userId as string);
        batch.update(refUser, {
            username: username,
            password: password,
            email: email,
            notificationFrequency: notificationFrequency,
            privacySetting: privacySetting,
            imageLink: imageUrl
        })
        await batch.commit();

        handleShow()
        
    }
    
    const confirmPasswordHandle = async () => {
        setPasswordConfirmation('')
        setShowPasswordConfirmation(false)

        if (passwordConfirmation === UserContext.user.password) {
            setMessageModal({
                message : "Update Success",
                variant : "primary"
            })
            updateProfilehandle()
        } else {
            setMessageModal({
                message : "Update Failed , Password Does Not Match",
                variant : "danger"
            })
            setShowSuccessUpdate(true)
        }
    }

    return (
        <div>
            <NavbarContentPage />
            <div className='homepage__content__container'>
                <LeftBarContentPage />
                <div className="homePage__content__mid__container">
                    <div className="userPage__content__mid">
                        <div className="homePage__title">
                            USER PROFILE
                        </div>
                        <div className="userPage__content">
                            <div className="userPage__profile">
                                {
                                    UserContext.user.imageLink ?
                                        (
                                            <img className='userPage__profile__img' src={UserContext.user.imageLink}></img>
                                        )
                                        :
                                        (
                                            <img className='userPage__profile__img' src={dummyPhoto} alt="" />
                                        )
                                }
                            </div>
                            <div className="userPage__UpdateProfile__border">
                                <div className="form__userPage">
                                    <form action="" />
                                    <div className="userPage__input__container">
                                        <div className="userPage__input__email">
                                            <label htmlFor="email">Email</label><br />
                                            <input className="input__email" disabled value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="text" placeholder="Your Email *" />
                                        </div>

                                        <div className="userPage__input__password">
                                            <label htmlFor="password">Password</label> <br />
                                            <input className="input__password" disabled value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="Your Password *" />
                                        </div>
                                        <div className="userPage__input__name">
                                            <label htmlFor="name">USERNAME</label> <br />
                                            <input className="input__name" value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="name" name="firstname" placeholder="Your Username *" />
                                        </div>
                                        <div className="userPage__input__privacySetting">
                                            <label htmlFor='privacySetting'>Privacy Setting</label> <br />
                                            <select className='input__privacySetting' value={privacySetting} onChange={(e) => { setPrivacySetting(e.target.value as enumPrivacySetting) }}>
                                                {
                                                    Object.keys(enumPrivacySetting).map((privacyData) => {
                                                        if (privacyData === privacySetting) {
                                                            return (
                                                                <option value={privacyData} selected>{privacyData}</option>
                                                            )
                                                        } else {
                                                            return (
                                                                <option value={privacyData}>{privacyData}</option>
                                                            )
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <div className="userPage__input__notificationSetting">
                                            <label htmlFor='notificationSetting'>Notification Setting</label> <br />
                                            <select className='input__notificationSetting' value={notificationFrequency} onChange={(e) => setNotificationFrequency(e.target.value as enumNotificationFrequency)}>
                                                {
                                                    Object.keys(enumNotificationFrequency).map((notifData) => {
                                                        if (notifData === notificationFrequency) {
                                                            return (
                                                                <option value={notifData} selected>{notifData}</option>
                                                            )
                                                        } else {
                                                            return (
                                                                <option value={notifData}>{notifData}</option>
                                                            )
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <div>
                                            <input className='' type="file" onChange={(e) => { setImageFile((e.target.files as FileList)[0] as File) }} />
                                        </div>
                                        <input value={"SAVE"} className="userPage__input__submit" id="submit-register" onClick={handleShowPasswordConfirmation} type="submit"></input>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FOR PASSWORD CONFIRMATION */}

            <Modal show={showPasswordConfirmation} onHide={handleClosePasswordConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>Passwrod Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="Password"
                                placeholder="Enter Your Password"
                                autoFocus
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePasswordConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmPasswordHandle}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* END OF MODAL PASSWORD CONFIRMATION */}

            {/* MODAL FOR SUCCESS UPDATE */}

            <Modal
                show={showSuccessUpdate}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>{messageModal.message}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant={messageModal.variant} onClick={handleClose}>OK</Button>
                </Modal.Footer>
            </Modal>

            {/* END MODAL FOR SUCCESS UPDATE */}
        </div>
    )
}

export default UserPage