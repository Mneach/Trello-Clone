import { midStyle, midStyleBoard, midStyleNotification, midStyleWorkspace } from "./style/midStyle_css"

export const MidContainer : React.FC<{children: React.ReactNode | React.ReactFragment , isDetailPage : boolean}> = ({ children , isDetailPage}) => {    

    const widthStyle = isDetailPage === true?{
        width : "85%",
    } : {
        width : "70%",
    }

    return(
        <div style={{...midStyle.container , ...widthStyle}}>
            {children}
        </div>
    )
}

export const MidContentContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyle.contentContainer}>
            {children}
        </div>
    )
}

export const MidContentCardContainer :  React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyle.contentCardContainer}>
            {children}
        </div>
    )
}

export const MidContentInputContainer :  React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyle.contentInputContainer}>
            {children}
        </div>
    )
}

export const MidCardContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyle.cardContainer}>
            {children}
        </div>
    )
}

export const MidInputContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyle.inputContainer}>
            {children}
        </div>
    )
}

export const MidUserProfileContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyle.userProfileContainer}>
            {children}
        </div>
    )
}

export const MidWorkspaceContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleWorkspace.workspaceMemeberContainer}>
            {children}
        </div>
    )
}

export const MidWorkspaceActionContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleWorkspace.workspaceActionContainer}>
            {children}
        </div>
    )
}

export const MidWorkspaceTableContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleWorkspace.workspaceTableContainer}>
            {children}
        </div>
    )
}

export const MidWorkspaceContentContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleWorkspace.workspaceContentContainer}>
            {children}
        </div>
    )
}

export const MidWorkspaceContentRightContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleWorkspace.workspaceContentRightContainer}>
            {children}
        </div>
    )
}

export const MidWorkspaceContentLeftContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleWorkspace.workspaceContentLeftContainer}>
            {children}
        </div>
    )
}

export const MidListContentContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleBoard.contentContainer}>
            {children}
        </div>
    )
}

export const MidListContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleBoard.listContainer}>
            {children}
        </div>
    )
}
export const MidListTitleContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleBoard.listTitleContainer}>
            {children}
        </div>
    )
}

export const MidNotificationContentContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleNotification.notificationContentContainer}>
            {children}
        </div>
    )
}

export const MidNotificationContent : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleNotification.notificationContent}>
            {children}
        </div>
    )
}

export const MidNotificationTitle : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={midStyleNotification.notificationContentTitle}>
            {children}
        </div>
    )
}