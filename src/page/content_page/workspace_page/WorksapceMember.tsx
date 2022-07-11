import React, { DetailedHTMLProps, MouseEventHandler, useState } from 'react'
import { useWorkspaceContext } from '../../../context/WorkspaceContext'
import NavbarContentPage from '../NavbarContentPage'
import LeftBarWorkspace from './LeftBarWorkspace'
import './style/Workspace__css.css'
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap'
import { GrantRevokeWorksapce, WorkspaceMember, WorkspaceType } from '../../../model/model'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { collection, doc, query, setDoc, WriteBatch, writeBatch } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { useUserContext } from '../../../context/UserContext'

const WorksapceMember = () => {

  const workspaceContext = useWorkspaceContext()
  const UserContext = useUserContext()
  const firestore = useFirestore()
  const batch = writeBatch(firestore)
  const [role, setRole] = useState({
    roleUser: "",
    userId: ""
  } as GrantRevokeWorksapce)

  // const getWorskpaceMember = collection(firestore, `WorkspaceCollection/${workspaceContext.workspace.workspaceId as string}/members/`)
  // const { status: statusWorkspaceMember, data: workspaceMember } = useFirestoreCollectionData(
  //     query(getWorskpaceMember) , {
  //         idField : 'docUserId'
  //     })

  // if(statusWorkspaceMember === 'loading'){
  //   return (<></>)
  // }
  
  // workspaceContext.workspace.workspaceMembers = workspaceMember as Array<WorkspaceMember>

  const changeRoleHandle = async ({ roleUser, userId }: GrantRevokeWorksapce) => {
    console.log(userId)
    console.log(roleUser)
    const refUser = doc(firestore, `WorkspaceCollection/${workspaceContext.workspace.workspaceId}/members/${userId}`)
    batch.update(refUser, {
      isAdmin: roleUser
    })


    if(userId === UserContext.user.userId){
      if(roleUser === 'Admin'){
        workspaceContext.currentUserWorkspaceRole = "Admin"
      }else{
        workspaceContext.currentUserWorkspaceRole = "Member"
      }
    }

    console.log(workspaceContext.workspace.workspaceMembers)
    await batch.commit();
  }

  const joinWorkspace = async () => {
    await setDoc(doc(db, `WorkspaceCollection/${workspaceContext.workspace.workspaceId}/members`, UserContext.user.userId), {
      username: UserContext.user.username,
      email: UserContext.user.email,
      isAdmin: "False" 
    })

    await setDoc(doc(db, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf`, workspaceContext.workspace.workspaceId), {
      workspaceId: workspaceContext.workspace.workspaceBoardId,
      workspaceTitle: workspaceContext.workspace.workspaceTitle
    })
  }

  return (
    <div>
      <NavbarContentPage />
      <div className='workspace__content__container'>
        <LeftBarWorkspace />
        <div className="workspace__content__mid__container">
          <div className="workspace__content__mid">
            <div className="workspace__title">
              WORKSPACE MEMBER
            </div>
            <div className="workspace__content__member">
              <div className="workspace__table__action__container">
                {/* {
                  workspaceContext.currentUserWorkspaceRole === "Guest" || workspaceContext.currentUserWorkspaceRole === "Member" ?
                    (<></>)
                    :
                    (<>
                      </>
                      )
                    } */}
                    <Button variant="primary" onClick={joinWorkspace}>Join Workspace</Button>
              </div>
              <div className="workspace__table__container">
                <Table striped bordered hover size="sm" className='workspace__table'>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      workspaceContext.workspace.workspaceMembers.map((workspaceMember) => (
                        <>
                          <tr>
                            <td>1</td>
                            <td>{workspaceMember.username}</td>
                            <td>{workspaceMember.email}</td>
                            {
                              workspaceContext.currentUserWorkspaceRole === "Guest" || workspaceContext.currentUserWorkspaceRole === "Member" ?
                                workspaceMember.isAdmin === "True" ?
                                  (
                                    <td>Admin</td>
                                  )
                                  :
                                  (
                                    <td>Member</td>
                                  )
                                :
                                (
                                  <>
                                    <select onChange={(e) => { setRole({ userId: workspaceMember.docUserId as string, roleUser: e.target.value as string }); }}>
                                      {
                                        workspaceMember.isAdmin === "True" ?
                                          (
                                            <>
                                              <option selected value="true">Admin</option>
                                              <option value="false">Member</option>
                                            </>
                                          )
                                          :
                                          (
                                            <>
                                              <option selected value="false">Member</option>
                                              <option value="true">Admin</option>
                                            </>
                                          )
                                      }
                                    </select>
                                    <button id='button__table__change' onClick={() => changeRoleHandle(role)} className='button__table__change'>change</button>
                                    <button id='button__table__remove' onClick={() => changeRoleHandle(role)} className='button__table__remove'>Remove</button>
                                  </>
                                )
                            }
                          </tr>
                        </>
                      ))
                    }
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default WorksapceMember