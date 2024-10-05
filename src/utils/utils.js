export const convertFileToUrl = (file) =>URL.createObjectURL(file)



 export const formatDate = (dateString)=>{
  const currentDate = new Date()
  const inputDate = new Date(dateString)

  const timeDifference = currentDate - inputDate

  const secondDifference = timeDifference / 1000

  if(secondDifference < 60){
    return `${Math.floor(secondDifference)} second ago`
  }else if(secondDifference < 3600){
    const minutes = Math.floor(secondDifference/60)
    return `${minutes} ${minutes === 1 ? 'minute': 'minutes'  } ago`
  }else if(secondDifference < 86400){
    const hours = Math.floor(secondDifference / 3600)
    return `${hours} ${hours === 1 ? 'hour': 'hours'} ago`
  } else{
    const days = Math.floor(secondDifference / 86400)
    return `${days} ${days === 1 ? 'day':'days'} ago`
  }

}

export const formatMassageTime = (dateString)=>{
  const messageDate = new Date(dateString)
  const now = new Date()

  // Check if the message is from today
  const isToday = messageDate.toDateString() === now.toDateString()

  // Format time 

  if(isToday){
    return messageDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
  }else{
    return messageDate.toLocaleDateString()
  }
}