import React from "react";

export const midStyle = {
    container: {
        borderTop: "1px solid rgba(47, 50, 64, 255)",
        paddingLeft: "60px",
    } as React.CSSProperties,

    contentContainer: {
        paddingTop: "60px",
        paddingRight: "60px",
        fontSize: "20px",
        display: "flex",
        flexDirection: "column",
    } as React.CSSProperties,

    userProfileContainer : {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
    } as React.CSSProperties,

    titleContent: {
        display: "flex",
        fontSize: "24px",
    } as React.CSSProperties,

    contentInputContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        alignItems: "center",
        width: "100%",
        fontSize: "16px",
        gap: "30px",
    } as React.CSSProperties,

    contentCardContainer: {
        display: "flex",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        alignItems: "center",
        width: "100%",
        fontSize: "16px",
        gap: "30px",
    } as React.CSSProperties,

    inputContainer: {
        width: "40%",
        marginTop: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    } as React.CSSProperties,

    cardContainer: {
        width: "230px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        color: "black",
        marginTop: "20px",
        cursor: "pointer",
    } as React.CSSProperties,

    cardTitle: {
        fontSize: "18px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: "20px",
    } as React.CSSProperties,

    cardContent: {
        padding: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        fontSize: "20px",
        whiteSpace: "nowrap",
        overflow: "hidden",
    } as React.CSSProperties,

    input: {
        width: "100%",
        marginTop: "4px",
        marginBottom: "16px",
        padding: "8px",
        border: "1px solid rgb(135, 134, 134)",
        borderRadius: "6px",
    } as React.CSSProperties,

    typeSubmit : {
        width: "100%",
        fontSize: "15px",
        backgroundColor: "rgb(36, 120, 230)",
        color: "white",
        padding: "10px 0px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        marginTop: "30px",
    } as React.CSSProperties,

}

export const midStyleWorkspace = {
    workspaceMemeberContainer : {
        width : "100%",
        marginTop : "30px",
        display : "flex",
        flexDirection : "column",
        alignItems : "center"
    } as React.CSSProperties,

    workspaceActionContainer : {
        width : "30%",
        display : "flex",
        justifyContent : "space-between",
        marginBottom : "60px",
    } as React.CSSProperties,

    workspaceTableContainer : {
        width : "60%",
    } as React.CSSProperties,

    workspaceContentContainer : {
        width : "100%",
        display : "flex",
        flexDirection : "column", 
        gap : "10px",
    } as React.CSSProperties,

    workspaceContent : {
        width : "100%",
        backgroundColor : "white",
        display : "flex",
        justifyContent : "space-between",
        height : "70px",
        borderRadius : "10px"
    } as React.CSSProperties,

    workspaceContentRightContainer : {
        marginRight : "10px",
        width : "50%",
        display : "flex",
        justifyContent : "flex-end",
        gap : "20px",
        alignItems : "center",
    } as React.CSSProperties,

    workspaceContentLeftContainer : {
        marginLeft : "10px",
        width : "50%",
        display : "flex",
        justifyContent : "flex-start",
        gap : "10px",
        alignItems : "center",
    } as React.CSSProperties,

    workspaceLeftContentImage : {
        alignItems : "center",
        width : "15%",
        borderRadius : "50%",
        border : "1px solid black"
    } as React.CSSProperties,

    workspaceLeftContentName : {
        display : "flex",
        flexDirection : "column",
        alignItems : "center",
    }as React.CSSProperties,

    text : {
        width : "100%",
        color : "black",
        fontSize : "15px",
        marginBottom : "0px",
        textAlign : "justify",
    }as React.CSSProperties,

    roleText : {
        width : "100%",
        color : "black",
        fontSize : "18px",
        marginBottom : "0px",
        textAlign : "right",
        marginRight : "30px",
    }as React.CSSProperties,
}

export const midStyleBoard =  {
    contentContainer : {
        width : "97%",
        height : "auto",
        display : "flex",
        justifyContent : "flex-start",
        overflow : "auto",
    }as React.CSSProperties,

    listContainer : {
        width : "300px",
        maxWidth : "300px",
        backgroundColor : " rgb(48, 151, 115)",
        minHeight : "150px",
        maxHeight : "auto",
        padding : "5px",
        margin : "20px",
        color : "black",
        alignItems : "center",
        display : "flex",
        flexDirection : "column",
        borderRadius : "5px",
        fontSize : "16px",
    } as React.CSSProperties,

    listTitleContainer : {
        marginTop : "10px",
        marginBottom : "10px",
        width : "90%",
        display : "flex",
        justifyContent : "space-between",
        alignItems : "center",
        fontSize : "18px",
        color : "rgb(235 , 235, 235)",
    } as React.CSSProperties,

    cardContainer : {
        marginTop : "10px",
        marginBottom : "10px",
        width : "90%",
        backgroundColor : "rgb(88, 179, 105)",
        borderRadius : "5px",
        height : "50px",
        color : "rgb(235 , 235, 235)",
        display : "flex",
        alignItems : "center",
        justifyContent : "center",
        border : "1px solid black",
    } as React.CSSProperties,

    cardName : {
        width : "100%",
        height : "100%",
    } as React.CSSProperties,

    deleteButton : {
        border: "none", /* Remove borders */
        color: "white", /* White text */
        fontSize: "16px", /* Set a font size */
        cursor: "pointer", /* Mouse pointer on hover */      
        backgroundColor : "transparent"
    } as React.CSSProperties
}