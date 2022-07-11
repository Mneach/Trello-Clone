import React, { MouseEventHandler, useState } from 'react'
import { useUserContext } from '../../../context/UserContext'
import { addDoc, collection, doc, query, setDoc, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollection, useFirestoreCollectionData } from 'reactfire'
import { WorkspaceType } from '../../../model/model'
import { union, uniq, uniqBy } from 'lodash'
import { Link } from 'react-router-dom'


const GetWorkspaceData = () => {

  const UserContext = useUserContext()
  const firestore = useFirestore()

  //=== Get Workspace From Firestore ===

  const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf/`)
  const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
    idField: 'uid'
  })

  const getPublicWorkspace = collection(firestore, 'WorkspaceCollection')
  const { status: statusWorkspacePublic, data: publicWorkspace } = useFirestoreCollectionData(
    query(getPublicWorkspace, where("workspaceVisibility", "==", "Public")), {
    idField: 'workspaceId'
  })

  if (statusWorkspace === 'loading' || statusWorkspacePublic === 'loading') {
    return (<div>GETTING WORKSPACE DATA</div>)
  }

  const userWorkspaceData = workspaceses as Array<WorkspaceType>
  const publicWorkspaceData = publicWorkspace as Array<WorkspaceType>
  // console.log(userWorkspaceData)
  // console.log(publicWorkspaceData)

  const workspaceData : Array<WorkspaceType> = uniqBy(union((userWorkspaceData), (publicWorkspaceData)), 'workspaceId')

  console.log(workspaceData)
  //=== End Of Get Workspace From Firestore ===  

  if (Array.isArray(workspaceData) && !workspaceData.length) {
    return (
      <div className="homePage__content__mid">
        <div className="homePage__title">
          THERE IS NO WORKSPACE
        </div>
      </div>

    )
  } else {
    return (
      <div className="homePage__content__mid">
        <div className="homePage__title">
          WORKSPACE DATA
        </div>
        <div className="homePage__content">
          {workspaceData.map((workspace) => (
            <Link to={`/ContentPage/Workspace/${workspace.workspaceId}/`} className="link__workspace">
              <div className="homePage__workspaceCard">
                <div className="homePage__workspaceCard__title">
                  {/* {workspace.workspaceTitle} */}
                </div>
                <div className="homePage__workspaceCard__content">
                  <p>{workspace.workspaceTitle}</p>
                </div>
              </div> 
            </Link>
          ))}
        </div>
      </div>
    )
  }
}

export default GetWorkspaceData 