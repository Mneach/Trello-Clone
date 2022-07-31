import { leftBarStyle } from "./style/leftBarStyle__css"

export const LeftBarTitle = ({ titleName, type }: { titleName: string, type: string }) => {

  const marginBottomStyle = type === "workspace" ? {
    borderBottom: "2px solid rgb(60, 211, 106)",
  } : {
    borderBottom: "2px solid rgb(218, 130, 64)",
  }
  return (
    <div style={{ ...leftBarStyle.title, ...marginBottomStyle }}>
      <p>{titleName}</p>
    </div>
  )
}