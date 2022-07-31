import { Link } from "react-router-dom"
import { ImageUser } from "../general/GeneralContent"
import { generalStyle } from "../general/generalStyle/generalStyle"
import { MidCardContainer } from "./MidContainer"
import { midStyle, midStyleWorkspace } from "./style/midStyle_css"

export const MidContentTitle = ({ titleName, data }: { titleName: string, data: boolean }) => {

    const justifyContentStyle = data === true ? {
        justifyContent: "flex-start",
    } : {
        justifyContent: "center",
    }

    return (
        <div style={{ ...midStyle.titleContent, ...justifyContentStyle }}>
            <p>{titleName}</p>
        </div>
    )
}

export const MidContentCard = ({ content, linkTo, type }: { content: string, linkTo: string, type: string }) => {

    const titleBackground = type === "Board" ?
        {
            backgroundColor: "rgb(218, 130, 64)",
        } : type === "Workspace" ? 
        {
            backgroundColor: "rgb(97, 203, 97)",
        } : 
        {
            backgroundColor : "rgb(235, 28, 66)",
        }

    return (
        <Link to={linkTo} style={generalStyle.LinkTo}>
            <MidCardContainer>
                <div style={{ ...midStyle.cardTitle, ...titleBackground }}></div>
                <div style={midStyle.cardContent}>
                    <p>{content}</p>
                </div>
            </MidCardContainer>
        </Link>
    )
}

export const MidWorkspaceContent: React.FC<{ children: React.ReactNode | React.ReactFragment }> = ({ children }) => {
    return (
        <div style={midStyleWorkspace.workspaceContent}>
            {children}
        </div>
    )
}

export const MidWorksapceLeftContent = ({ name, email, image }: { name: string, email: string, image: string }) => {
    return (
        <>
            <img style={midStyleWorkspace.workspaceLeftContentImage} src={image} alt="" />
            <div style={midStyleWorkspace.workspaceLeftContentName}>
                <p style={{...midStyleWorkspace.text , fontWeight : "bold"}}>{name}</p>
                <p style={midStyleWorkspace.text}>{email}</p>
            </div>
        </>
    )
}

export const MidWorkspaceRoleName = ({isAdmin} : {isAdmin : string}) =>{

    let roleName
    if(isAdmin === "True") roleName = "Admin"
    else roleName = "Member"

    return (
        <p style={midStyleWorkspace.roleText}>{roleName}</p>
    )
} 