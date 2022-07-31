import { useState } from 'react'
import LeftBarContentPage from '../LeftBarContentPage'
import NavbarContentPage from '../NavbarContentPage'
import dummyPhoto from '../../../lib/photo/dummy.png';
import { useUserContext } from '../../../context/UserContext';
import { enumNotificationFrequency, enumPrivacySetting } from '../../../model/model';
import { useFirestore } from 'reactfire';
import { doc, writeBatch } from 'firebase/firestore';
import { Modal, Button, Form } from 'react-bootstrap'
import { storage } from '../../../lib/firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { GeneralContentContainer } from '../../../component/general/GeneralContainer';
import { SuccessUpdatePopUp } from '../../../component/modal/Modal';
import { LeftBarContainer } from '../../../component/leftBar/LeftContainer';
import { MidContainer, MidContentContainer, MidContentInputContainer, MidInputContainer, MidUserProfileContainer } from '../../../component/midContent/MidContainer';
import { MidContentTitle } from '../../../component/midContent/MidContent';
import { InputSelectUserSetting, InputSubmit, InputText } from '../../../component/midContent/MidForm';
import { ImageUser } from '../../../component/general/GeneralContent';

const UserPage = () => {

    const UserContext = useUserContext()
    const firestore = useFirestore()
    const batch = writeBatch(firestore)
    const auth = getAuth()

    // === USER GETTER SETTER ===

    const [username, setUsername] = useState(UserContext.user.username)
    const [email, setEmail] = useState(UserContext.user.email)
    const [password, setPassword] = useState(UserContext.user.password)
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [notificationFrequency, setNotificationFrequency] = useState<enumPrivacySetting | enumNotificationFrequency>(UserContext.user.notificationFrequency)
    const [privacySetting, setPrivacySetting] = useState<enumPrivacySetting | enumNotificationFrequency>(UserContext.user.privacySetting)
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
        message: '',
        variant: ''
    })

    // === END GETTER SETTER FOR MODAL===

    const updateProfilehandle = async () => {

        let imageUrl = ''
        if (UserContext.user.imageLink !== undefined) {
            imageUrl = UserContext.user.imageLink
        }

        if (imageFile !== undefined) {
            const refStorage = ref(storage, `${UserContext.user.userId}/${(imageFile as File).name}`)
            await uploadBytes(refStorage, imageFile as File, { contentType: 'profile pic' })
            imageUrl = await getDownloadURL(refStorage)
        }

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
                message: "Update Success",
                variant: "primary"
            })
            updateProfilehandle()
        } else {
            setMessageModal({
                message: "Update Failed , Password Does Not Match",
                variant: "danger"
            })
            setShowSuccessUpdate(true)
        }
    }

    return (
        <div>
            <NavbarContentPage />
            <GeneralContentContainer>
                <LeftBarContainer>
                    <LeftBarContentPage />
                </LeftBarContainer>
                <MidContainer isDetailPage={false}>
                    <MidContentContainer>
                        <MidContentTitle titleName={"USER PROFILE"} data={false}></MidContentTitle>
                        <MidContentInputContainer>
                            <MidUserProfileContainer>
                                {
                                    UserContext.user.imageLink ?
                                        (<ImageUser src={UserContext.user.imageLink} size="50%" borderRadiusSize={"10%"} ></ImageUser>)
                                        :
                                        (<ImageUser src={dummyPhoto} size="50%" borderRadiusSize={"10%"} ></ImageUser>)
                                }
                            </MidUserProfileContainer>
                            <MidInputContainer>
                                <label htmlFor="email">Email</label>
                                <InputText type={"text"} isDisable={true} value={email} setValue={setEmail}></InputText>

                                <label htmlFor="password">Password</label>
                                <InputText type={"password"} isDisable={true} value={password} setValue={setPassword}></InputText>

                                <label htmlFor="name">USERNAME</label>
                                <InputText type={"text"} isDisable={false} value={username} setValue={setUsername}></InputText>

                                <label htmlFor='privacySetting'>Privacy Setting</label>
                                <InputSelectUserSetting value={privacySetting} setValue={setPrivacySetting} enumType="privacySetting"></InputSelectUserSetting>

                                <label htmlFor='notificationSetting'>Notification Setting</label>
                                <InputSelectUserSetting value={notificationFrequency} setValue={setNotificationFrequency} enumType="frequencySetting"></InputSelectUserSetting>
                                <div>
                                    <input className='' type="file" onChange={(e) => { setImageFile((e.target.files as FileList)[0] as File) }} />
                                </div>

                                <InputSubmit valueName='SAVE' onClickFunction={handleShowPasswordConfirmation}></InputSubmit>
                            </MidInputContainer>
                        </MidContentInputContainer>
                    </MidContentContainer>
                </MidContainer>
            </GeneralContentContainer>

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
            <SuccessUpdatePopUp showSuccessUpdate={showSuccessUpdate} setShowSuccessUpdate={setShowSuccessUpdate} title={messageModal.message} buttonVariant={messageModal.variant}></SuccessUpdatePopUp>
        </div>
    )
}

export default UserPage