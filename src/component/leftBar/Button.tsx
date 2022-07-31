import { useState } from "react";
import { Link } from "react-router-dom";
import { ButtonLeftBarModel, CreateButtonLeftBarModel } from "../../model/componentModel";
import { generalStyle } from "../general/generalStyle/generalStyle";
import { midStyleBoard } from "../midContent/style/midStyle_css";
import { leftBarStyle } from "./style/leftBarStyle__css";

export function LinkButton({ icon, linkName, linkTo }: ButtonLeftBarModel) {

    const [isHover, setIsHover] = useState(false)

    const handleMouseEnter = () => {
        setIsHover(true);
    };

    const handleMouseLeave = () => {
        setIsHover(false);
    };

    const styleHover = isHover ? {
        backgroundColor: "white",
        color: "black",
        cursor: "pointer",
    } :{ }

    return (
        <Link to={linkTo} style={generalStyle.LinkTo} >
            <div style={{ ...leftBarStyle.content__left , ...styleHover}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div style={leftBarStyle.icon}>
                    {icon}
                </div>
                <div style={leftBarStyle.linkName}>
                    {linkName}
                </div>
            </div>
        </Link>
    )
}

export function CreateButton({ icon, name, setShow }: CreateButtonLeftBarModel) {
    const [isHover, setIsHover] = useState(false)

    const handleMouseEnter = () => {
        setIsHover(true);
    };

    const handleMouseLeave = () => {
        setIsHover(false);
    };

    const styleHover = isHover ? {
        backgroundColor: "white",
        color: "black",
        cursor: "pointer",
    } :{ }
    
    const handleShow = () => setShow(true);
    return (
        <div style={{ ...leftBarStyle.content__left , ...styleHover}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleShow}>
            <div style={leftBarStyle.icon}>
                {icon}
            </div>
            <div style={leftBarStyle.linkName}>
                {name}
            </div>
        </div>
    )
}

export function CreateIconButton ( {icon , onClickFunction} : {icon : JSX.Element , onClickFunction : () => Promise<void>}) {
    return(
        <button style={{...midStyleBoard.deleteButton}} onClick={onClickFunction}>
            {icon}
        </button>
    )
}