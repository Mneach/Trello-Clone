import { doc, writeBatch } from 'firebase/firestore'
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useFirestore } from 'reactfire'
import { useUserContext } from '../../../context/UserContext'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import { enumWorkspaceVisibility } from '../../../model/model'
import NavbarContentPage from '../NavbarContentPage'
import LeftBarWorkspace from './LeftBarWorkspace'
import './style/WorkspaceSetting__css.css'
import './style/Workspace__css.css'

const WorkspaceSetting = () => {

  const UserContext = useUserContext()
  const workspaceContext = useWorkspaceContext()
  const [workspaceTitle, setWorkspaceTitle] = useState(workspaceContext.workspace.workspaceTitle)
  const [workspaceDescription, setWorkspaceDescription] = useState(workspaceContext.workspace.workspaceDescription)
  const [workspaceVisibility, setWorkspaceVisibiltiy] = useState(workspaceContext.workspace.workspaceVisibility)
  const firestore = useFirestore()
  const batch = writeBatch(firestore)

  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const handleClose = () => setShowSuccessUpdate(false);
  const handleShow = () => setShowSuccessUpdate(true);

  const updateWorkspaceHandle = async () => {

    const refWorkspace = doc(firestore, "WorkspaceCollection", workspaceContext.workspace.workspaceId as string);
    batch.update(refWorkspace, {
      workspaceTitle: workspaceTitle,
      workspaceVisibility: workspaceVisibility,
      workspaceDescription: workspaceDescription
    })
    
    const refUser = doc(firestore , `UserCollection/${UserContext.user.userId}/memberWorkspaceOf` , workspaceContext.workspace.workspaceId as string)
    batch.update(refUser , {
      workspaceTitle : workspaceTitle
    })
    
    await batch.commit()

    handleShow()
  }

  return (
    <div>
      <NavbarContentPage />
      <div className='workspace__content__container'>
        <LeftBarWorkspace />
        <div className="workspace__content__mid__container">
          <div className="workspace__content__mid">
            <div className="workspace__title">
              WORKSPACE SETTING
            </div>
            <div className="workspace__content">
              <div className="workspace__UpdateProfile__border">
                <div className="form__workspace">
                  <form action="" />
                  <div className="workspace__input__container">

                    <div className="workspace__input__email">
                      <label htmlFor="email">Workspace Title</label><br />
                      {
                        workspaceContext.currentUserWorkspaceRole === 'Admin' ?
                          (
                            <input className="input__email" value={workspaceTitle} onChange={(e) => setWorkspaceTitle(e.target.value)} id="email" type="text" placeholder="Your Email *" />
                          )
                          :
                          (
                            <input className="input__email" disabled value={workspaceTitle} onChange={(e) => setWorkspaceTitle(e.target.value)} id="email" type="text" placeholder="Your Email *" />
                          )
                      }
                    </div>

                    <div className="workspace__input__privacySetting">
                      <label htmlFor='privacySetting'>Workspace Visibility</label> <br />
                      {
                        workspaceContext.currentUserWorkspaceRole === 'Admin' ?
                          (
                            <select className='input__privacySetting' value={workspaceVisibility} onChange={(e) => { setWorkspaceVisibiltiy(e.target.value as enumWorkspaceVisibility) }}>
                              {
                                Object.keys(enumWorkspaceVisibility).map((WorkpsaceVisibilityData) => {
                                  if (WorkpsaceVisibilityData === workspaceVisibility) {
                                    return (
                                      <option value={WorkpsaceVisibilityData} selected>{WorkpsaceVisibilityData}</option>
                                    )
                                  } else {
                                    return (
                                      <option value={WorkpsaceVisibilityData}>{WorkpsaceVisibilityData}</option>
                                    )
                                  }
                                })
                              }
                            </select>

                          )
                          :
                          (
                            <select disabled className='input__privacySetting' value={workspaceVisibility} onChange={(e) => { setWorkspaceVisibiltiy(e.target.value as enumWorkspaceVisibility) }}>
                              {
                                Object.keys(enumWorkspaceVisibility).map((WorkpsaceVisibilityData) => {
                                  if (WorkpsaceVisibilityData === workspaceVisibility) {
                                    return (
                                      <option value={WorkpsaceVisibilityData} selected>{WorkpsaceVisibilityData}</option>
                                    )
                                  } else {
                                    return (
                                      <option value={WorkpsaceVisibilityData}>{WorkpsaceVisibilityData}</option>
                                    )
                                  }
                                })
                              }
                            </select>
                          )
                      }
                    </div>
                    <label htmlFor="WorkspaceDescription">Workspace Description</label>
                    {
                      workspaceContext.currentUserWorkspaceRole === 'Admin' ?
                        (
                          <>
                            <textarea value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value as string)}>

                            </textarea>

                            <input className="workspace__input__submit" value={"SAVE"} onClick={updateWorkspaceHandle} type="submit"></input>
                          </>
                        )
                        :
                        (
                          <>
                            <textarea disabled value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value as string)}>
                            </textarea>
                          </>
                        )
                    }
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FOR SUCCESS UPDATE */}

      <Modal
        show={showSuccessUpdate}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Update Success</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>OK</Button>
        </Modal.Footer>
      </Modal>

      {/* END MODAL FOR SUCCESS UPDATE */}
    </div>
  )
}

export default WorkspaceSetting