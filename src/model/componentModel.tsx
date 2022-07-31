import { enumBoardVisibility, enumNotificationFrequency, enumPrivacySetting, enumWorkspaceVisibility, GrantRevokeWorksapce } from "./model";

export interface ButtonLeftBarModel{
    icon : JSX.Element,
    linkTo : string,
    linkName : string,
}

export interface CreateButtonLeftBarModel{
    icon : JSX.Element,
    name : string,
    setShow : React.Dispatch<React.SetStateAction<boolean>>,
}

export interface SuccessUpdatePopUpModel{
    showSuccessUpdate : boolean,
    setShowSuccessUpdate : React.Dispatch<React.SetStateAction<boolean>>,
    title : string,
    buttonVariant : string,
}

export interface SuccessPopUpWithBodyModel{
    showSuccessUpdate : boolean,
    setShowSuccessUpdate : React.Dispatch<React.SetStateAction<boolean>>,
    title : string,
    buttonVariant : string,
    messageBody : string,
}


export interface InputTextModel {
    type : string,
    value : string,
    setValue : React.Dispatch<React.SetStateAction<string>>,
    isDisable : boolean,
}

export interface InputSelectVisibilityModel{
    value : string,
    setValue : React.Dispatch<React.SetStateAction<enumWorkspaceVisibility | enumBoardVisibility>>,
    isDisable : boolean, 
    enumType : string 
}

export interface InputTextAreaModel{
    value : string
    setValue : React.Dispatch<React.SetStateAction<string>>,
    isDisable : boolean
}

export interface InputSelectUserSettingModel{
    value : string,
    setValue : React.Dispatch<React.SetStateAction<enumPrivacySetting | enumNotificationFrequency>>,
    enumType : string 
}

export interface InputRoleWorkspaceModel {
    value : string,
    setValue : React.Dispatch<React.SetStateAction<GrantRevokeWorksapce>>,
    onClickFunction : () => Promise<void> 
    userId : string,
}