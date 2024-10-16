import React, { useEffect, useRef, useState } from 'react'
import PostCard from '../../components/shared/PostCard'
import { useGetRecentPosts, useGetUsers } from '../../lib/react-query/queries'
import { Loader } from 'react-feather'
import UserCard from '../../components/shared/UserCard'

const Home = () => {

  

  // console.log(posts) //log the posts array to inspect its structure
  const {data:posts,isLoading:isPostLoading,isError:isErrorPosts} = useGetRecentPosts()
  const {data:creators,isLoading:isUserLoading,isError:isErrorCreators} = useGetUsers(10)



if(isErrorPosts || isErrorCreators){
  return(
    <div className="flex flex-1
    ">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <p className="body-medium text-light-1">Something bad happened</p>
      </div>
    </div>
  )
}
  

  


  return (
    <div className='flex flex-1'>
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>
          {isPostLoading && !posts ?(
            <Loader/>
          ):(
            <ul className='flex flex-col flex-1 gap-9 w-full '>
              {posts?.documents.map((post)=>(
                <li key={post.$id} className='flex justify-center w-full'>
                  <PostCard post={post}/>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home


