import { collection, doc, query, where } from 'firebase/firestore';
import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreCollection, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { enumWorkspaceVisibility, UserType, WorkspaceMember, WorkspaceType } from '../model/model';
import { useUserContext } from './UserContext';


type Props = {
    children: React.ReactNode | React.ReactFragment;
}

type workspaceContextProps = {
    workspace: WorkspaceType,
    currentUserWorkspaceRole : string
}

export function useWorkspaceContext() {
    return useContext(WorkspaceContext)
}

const WorkspaceContext = React.createContext<workspaceContextProps>({
    workspace: {
        workspaceId: '',
        workspaceTitle: '',
        workspaceVisibility: enumWorkspaceVisibility.Private,
        workspaceDescription: '',
        workspaceMembers: [],
        workspaceBoardId : []
    },
    currentUserWorkspaceRole : ''
})



const WorkspaceProvider: React.FC<Props> = ({ children }) => {

    const firestore = useFirestore()
    const { workspaceId } = useParams()
    const UserContext = useUserContext()

    
    const getWorskpaceDetail = doc(firestore, 'WorkspaceCollection', workspaceId as string)
    const { status: statusWorkspaceDetail, data: workspaceDetail } = useFirestoreDocData(getWorskpaceDetail)
    
    const getWorskpaceMember = collection(firestore, `WorkspaceCollection/${workspaceId as string}/members/`)
    const { status: statusWorkspaceMember, data: workspaceMember } = useFirestoreCollectionData(
        query(getWorskpaceMember) , {
            idField : 'docUserId'
        })
        
        if (statusWorkspaceDetail === 'loading') {
            // console.log("ambil data...")
            return (<div>GET WORKSPACE DATA...</div>)
        }

        if(statusWorkspaceMember === 'loading'){
            // console.log("ambil data... 2")
            return(<div>GET WORKSPACE DATA 2</div>)
        }
        
        const workspaceDetailData = workspaceDetail as WorkspaceType
        workspaceDetailData.workspaceId = workspaceId as string
        workspaceDetailData.workspaceMembers = workspaceMember as Array<WorkspaceMember>
        
        let checkUserIsWorkspaceMember : boolean = false
        let indexCurrentUser : number = -1
        let userWorkspaceRole = ''
        // console.log(workspaceId)
        // console.log(workspaceMember)
        for (let index = 0; index < workspaceDetailData.workspaceMembers.length; index++) {
            if(workspaceDetailData.workspaceMembers[index].docUserId === UserContext.user.userId){
            checkUserIsWorkspaceMember = true;
            indexCurrentUser = index
        }  
    }
    
    if(checkUserIsWorkspaceMember === true){
        if(workspaceDetailData.workspaceMembers[indexCurrentUser].isAdmin === "True"){
            userWorkspaceRole = "Admin"
        }else{
            userWorkspaceRole = "Member"
        }
    }else{
        userWorkspaceRole = "Guest"
    }  
    
    // console.log(userWorkspaceRole)

    return (
        <WorkspaceContext.Provider value={{ workspace: workspaceDetailData , currentUserWorkspaceRole : userWorkspaceRole}} >
            {children}
        </WorkspaceContext.Provider>
    )
}
export default WorkspaceProvider