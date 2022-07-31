import axios from "axios"
import { sentEmailType } from "../../model/model"

export const sentEmailWorkspaceInvitation = async (workspaceTitle : string , workspaceAdmin : string , toUser : string[] , link : string) => {
    try{
        await axios({
            method : "post",
            url: "http://localhost:1234/sendemailworkspaceinvitation",
            data : { workspaceTitle , workspaceAdmin , toUser , link }
        })
    } catch (error){
        alert(error)
    }
}

export const sentEmailBoardInvitation = async (workspaceTitle : string , workspaceAdmin : string , toUser : string[] , link : string) => {
    try{
        await axios({
            method : "post",
            url: "http://localhost:1234/sendemailboardinvitation",
            data : { workspaceTitle , workspaceAdmin , toUser , link }
        })
    } catch (error){
        alert(error)
    }
}