import { generalStyle } from "./generalStyle/generalStyle"

export const ImageUser = ({src , size , borderRadiusSize} : {src : string , size : string , borderRadiusSize : string}) => {
  
    const imageSize = {
        width: size
    }

    const imageBorderRadius = {
        borderRadius : borderRadiusSize
    }

    return(
        <img style={{...generalStyle.imageProfile , ...imageSize , ...imageBorderRadius}} src={src}></img>
    )
}