import React from "react";

export const rightBarStyle = {
    container : {
        width : "15%",
        paddingLeft : "20px",
        paddingRight : "20px",
        borderLeft: "1px solid rgba(47, 50, 64, 255)",
        fontSize : "16px"
    } as React.CSSProperties,

    contentContainer : {
        width : "100%",
        display : "flex",
        justifyContent : "center",
        flexDirection : "column",
        alignItems : "center",
        marginTop : "40px",
    } as React.CSSProperties,

    imageContainer : {
        width : "100%",
        display : "flex",
        justifyContent : "center",
        marginBottom : "20px"
    } as React.CSSProperties,

    userDataContainer : {
        width :"100%",
        display : "flex",
        justifyContent : "center",
    }as React.CSSProperties,
}