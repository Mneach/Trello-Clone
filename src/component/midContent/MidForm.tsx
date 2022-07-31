import { useState } from "react"
import { InputRoleWorkspaceModel, InputSelectUserSettingModel, InputSelectVisibilityModel, InputTextAreaModel, InputTextModel } from "../../model/componentModel"
import { enumBoardVisibility, enumNotificationFrequency, enumPrivacySetting, enumWorkspaceVisibility, GrantRevokeWorksapce } from "../../model/model"
import { midStyle } from "./style/midStyle_css"

export const InputText = ({ type, value, setValue, isDisable }: InputTextModel) => {
    return (
        <input disabled={isDisable} style={midStyle.input} value={value} onChange={(e) => setValue(e.target.value)} type={type} />
    )
}

export const InputSelectVisibility = ({ value, setValue, isDisable, enumType }: InputSelectVisibilityModel) => {

    if (enumType === "workspace") {
        return (
            <select disabled={isDisable} style={midStyle.input} value={value} onChange={(e) => { setValue(e.target.value as enumWorkspaceVisibility) }}>
                {
                    Object.keys(enumWorkspaceVisibility).map((visibilityData) => {
                        if (visibilityData === value) {
                            return (<option value={visibilityData} selected>{visibilityData}</option>)
                        } else {
                            return (<option value={visibilityData}>{visibilityData}</option>)
                        }
                    })
                }
            </select>
        )
    } else {
        return (
            <select disabled={isDisable} style={midStyle.input} value={value} onChange={(e) => { setValue(e.target.value as enumBoardVisibility) }}>
                {
                    Object.keys(enumBoardVisibility).map((visibilityData) => {
                        if (visibilityData === value) {
                            return (<option value={visibilityData} selected>{visibilityData}</option>)
                        } else {
                            return (<option value={visibilityData}>{visibilityData}</option>)
                        }
                    })
                }
            </select>
        )
    }
}

export const InputSelectUserSetting = ({ value, setValue, enumType }: InputSelectUserSettingModel) => {
    if (enumType === "privacySetting") {
        return (
            <select style={midStyle.input} value={value} onChange={(e) => { setValue(e.target.value as enumPrivacySetting) }}>
                {
                    Object.keys(enumPrivacySetting).map((privacyData) => {
                        if (privacyData === value) {
                            return (<option value={privacyData} selected>{privacyData}</option>)
                        } else {
                            return (<option value={privacyData}>{privacyData}</option>)
                        }
                    })
                }
            </select>
        )
    } else {
        return (
            <select style={midStyle.input} value={value} onChange={(e) => setValue(e.target.value as enumNotificationFrequency)}>
                {
                    Object.keys(enumNotificationFrequency).map((notifData) => {
                        if (notifData === value) {
                            return (<option value={notifData} selected>{notifData}</option>)
                        } else {
                            return (<option value={notifData}>{notifData}</option>)
                        }
                    })
                }
            </select>
        )
    }
}

export const InputRoleWorkspace = ({ value, setValue, onClickFunction, userId }: InputRoleWorkspaceModel) => {
    <select style={midStyle.input} onChange={(e) => { setValue({ userId: userId, roleUser: e.target.value as string }); }}>
        {
            Object.keys(enumNotificationFrequency).map((notifData) => {
                if (notifData === value) {
                    return (<option value={notifData} selected>{notifData}</option>)
                } else {
                    return (<option value={notifData}>{notifData}</option>)
                }
            })
        }
    </select>
}

export const InputTextArea = ({ value, setValue, isDisable }: InputTextAreaModel) => {
    return (
        <textarea disabled={isDisable} value={value} onChange={(e) => setValue(e.target.value as string)}></textarea>
    )
}

export const InputSubmit = ({ valueName, onClickFunction }: { valueName: string, onClickFunction: (() => Promise<void>) | (() => void) }) => {
    const [isHover, setIsHover] = useState(false)

    const handleMouseEnter = () => {
        setIsHover(true);
    };

    const handleMouseLeave = () => {
        setIsHover(false);
    };

    const styleHover = isHover ? {
        backgroundColor: "rgb(42, 69, 160)",
    } : {}

    return (
        <input style={{ ...midStyle.typeSubmit, ...styleHover }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} value={valueName} onClick={onClickFunction} type="submit"></input>
    )
}