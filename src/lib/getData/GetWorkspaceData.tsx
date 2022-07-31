import { useUserContext } from '../../context/UserContext'
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { WorkspaceType } from '../../model/model'
import { union, uniqBy } from 'lodash'
import { Link } from 'react-router-dom'
import { MidContainer, MidContentCardContainer, MidContentContainer } from '../../component/midContent/MidContainer'
import { MidContentCard, MidContentTitle } from '../../component/midContent/MidContent'


const GetWorkspaceData = () => {

  const UserContext = useUserContext()
  const firestore = useFirestore()

  //=== Get Workspace From Firestore ===

  const getWorkspaceByUserId = collection(firestore, `UserCollection/${UserContext.user.userId}/memberWorkspaceOf/`)
  const { status: statusWorkspace, data: workspaceses } = useFirestoreCollectionData(query(getWorkspaceByUserId), {
    idField: 'workspaceId'
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
  const workspaceData: Array<WorkspaceType> = uniqBy(union((userWorkspaceData), (publicWorkspaceData)), 'workspaceId')
  //=== End Of Get Workspace From Firestore ===  

  if (Array.isArray(workspaceData) && !workspaceData.length) {
    return (
      <MidContentContainer>
        <MidContentTitle titleName={" THERE IS NO WORKSPACE"} data={false}></MidContentTitle>
      </MidContentContainer>
    )
  } else {
    return (
      <MidContentContainer>
        <MidContentTitle titleName={" Workspace Data "} data={true}></MidContentTitle>
        <MidContentCardContainer>
          {workspaceData.map((workspace) => (
            <MidContentCard type="Workspace" content={workspace.workspaceTitle} linkTo={`/ContentPage/Workspace/${workspace.workspaceId}/Boards`} ></MidContentCard>
          ))}
        </MidContentCardContainer>
      </MidContentContainer>
    )
  }
}

export default GetWorkspaceData 