import React from 'react'
import { useGetCurrentUser } from '../../lib/react-query/queries'
import { Loader } from 'react-feather'
import GridPostList from "../../components/shared/GridPostList"

const LikedPosts = () => {
  const {data: currentUser}= useGetCurrentUser()
  if(!currentUser){
    return(
      <div className="flex items-center justify-center w-full h-full">
        <Loader/>
      </div>
    )
  }
  return (
    <>
    {currentUser.liked.length === 0 && (
      <p className="text-light-4">No liked Posts</p>
    )}
    <GridPostList post={currentUser.liked} showStats={false}/>
    </>
  )
}

export default LikedPosts