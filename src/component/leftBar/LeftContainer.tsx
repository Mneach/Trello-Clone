import React from "react";
import { leftBarStyle } from "./style/leftBarStyle__css";

export const LeftBarContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {    

    return(
        <div style={leftBarStyle.container}>
            {children}
        </div>
    )
}

export const LeftBarTitleContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {

    return (
        <div style={leftBarStyle.titleContainer}>
            {children}
        </div>
    )
}