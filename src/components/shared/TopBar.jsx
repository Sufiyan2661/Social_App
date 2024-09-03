import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/AuthContext'

const TopBar = () => {

    const {SignOut,user} = useAuth()

    const navigate = useNavigate()



    useEffect(()=>{
        if(!user) navigate('/sign-in')
    },[user])

    const handleSignOut = async () =>{
        const success  = await SignOut()
        if(success) navigate('/sign-in')
    }


  return (
    <div className='sticky top-0 z-50 md:hidden bg-dark-2 w-full'>
        <div className="flex justify-between items-center py-4 px-5">
            <Link to="/" className='flex gap-3 items-center'>
            <img src="/assets/logo.svg" alt="logo" width={130} height={325} />
            </Link>

            <div className="flex gap-4">
                <button className='flex gap-4 items-center justify-start hover:bg-transparent hover:text-white ' onClick={handleSignOut}>
                    <img src="/assets/Icon/logout.svg" alt="" />
                </button>
                <Link to={`/profile/${user.$id}`} className='flex justify-center items-center'>
                <img src={user.imageUrl} alt="profile" className='h-8 w-8 rounded-full' />
                </Link>
            </div>
        </div>
    </div>
  )
}

export default TopBar