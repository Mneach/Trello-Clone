  
export const createMilisecond = (number : number , type : string) => {
    if(type === "minute"){
      return number * 60000 as number
    }else if(type === "seconds"){
      return number * 1000 as number
    }else if(type === "hour"){
      return number * 3600000 as number
    }
}

export const createTimeFromMilisecond = (number : number , type : string) => {
  if(type === "minute"){
    return number / 60000 as number
  }else if(type === "seconds"){
    return number / 1000 as number
  }else if(type === "hour"){
    return number / 3600000 as number
  }else{
    return number / 86400000 as number
  }
}