import { rightBarStyle } from "./style/rightBarStyle__css"


export const RightBarContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {    

    return(
        <div style={rightBarStyle.container}>
            {children}
        </div>
    )
}

export const RightBarContentContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {    

    return(
        <div style={rightBarStyle.contentContainer}>
            {children}
        </div>
    )

}

export const RightBarImageContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {    

    return(
        <div style={rightBarStyle.imageContainer}>
            {children}
        </div>
    )
    
}

export const RightUserDataContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {    

    return(
        <div style={rightBarStyle.userDataContainer}>
            {children}
        </div>
    )
    
}