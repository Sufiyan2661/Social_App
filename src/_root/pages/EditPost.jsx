import React, { useEffect, useState } from 'react'
import PostForm from '../../components/forms/PostForm'
import { useParams } from 'react-router-dom'
import { Loader } from 'react-feather'
import { useGetPostById } from '../../lib/react-query/queries'

const EditPost = () => {

  
  const {id} = useParams()
  const {data: post,isLoading} = useGetPostById(id)


if(isLoading){
  return(
    <div className='flex justify-center items-center w-full h-full'>
      <Loader/>
    </div>
  )
}

  return (
    <div className='flex flex-1'>
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-5xl flex justify-start items-center gap-3 w-full">
          <img src="/assets/Icon/add-post.svg"
          width={36}
          height={36} 
          alt="add" 
          />
          <h2 className="h3-bold md:h2-bold">Edit Post</h2>
        </div>

       {isLoading ? <Loader/> :  <PostForm action="Update" post={post}/>}
      </div>
     
    </div>
  )
}

export default EditPost