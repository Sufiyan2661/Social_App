import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom'

const UserCard = ({users}) => {
    
    const navigate = useNavigate()
    
  return (

    <div className='flex items-center justify-center flex-col gap-4 border border-dark-4 rounded-[20px] px-5 py-8'>
    <img src={users?.imageUrl || "/assets/Icon/profile-placeholder.svg"} alt="creator" className='rounded-full w-14 h-14' />
    <div className="flex items-center justify-center flex-col gap-1">
      <p className="base-medium text-light-1 text-center line-clamp-1">{users?.name}</p>
    </div>

    <button type='button' className='bg-primary-500 hover:bg-primary-600 text-light-1 flex gap-2 px-5'
      onClick={() => navigate(`/message/${users.$id}`)}>Message</button>
  </div>




    
//    <div 
// //    to={`/profile/${user.$id}`}
// // to={`/message/${user.$id}`}

//     className=' flex items-center justify-center flex-col gap-4 border border-dark-4 rounded-[20px] px-5 py-8'>
//     <img src={users.imageUrl || "/assets/Icon/profile-placeholder.svg"}
//      alt="creator"
//      className='rounded-full w-14 h-14' />
//      <div className="flex items-center justify-center flex-col gap-1">
   
//         <p className="base-medium text-light-1 text-center line-clamp-1">
//             {users.name}
//         </p>
      

//      </div>




//         <button type='button' className='bg-primary-500 hover:bg-primary-600 text-light-1 flex gap-2 px-5' onClick={()=>navigate(`/message/${users.$id}`)}>
//             Message
//         </button>
   
//    </div>
  )
}

export default UserCard