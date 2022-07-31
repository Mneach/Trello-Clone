import { generalStyle } from "./generalStyle/generalStyle"

export const GeneralContentContainer : React.FC<{children: React.ReactNode | React.ReactFragment}> = ({ children }) => {  
    return(
        <div style={generalStyle.container}>
            {children}
        </div>
    )
}
