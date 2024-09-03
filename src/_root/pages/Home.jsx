import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../utils/AuthContext'
import PostCard from '../../components/shared/PostCard'

const Home = () => {

  const [posts,setPosts] = useState([])

  console.log(posts) //log the posts array to inspect its structure



  const {getRecentPosts,isLoading} = useAuth()

  useEffect(()=>{
   const fetchPosts = async ()=>{
    try {
      const fetchedPosts = await getRecentPosts()
      console.log("Structure:",fetchedPosts)
      console.log("Documents:",fetchedPosts?.documents)
      if(fetchedPosts){
        setPosts(fetchedPosts?.documents || [])
      }else{
        console.log("No post returned")
      }
    } catch (error) {
      console.log("Failed to fetch posts:",error)
    }
   }

   fetchPosts()
  },[getRecentPosts])


  return (
    <div className='flex flex-1'>
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>
          {isLoading ?(
            <span>Loading...</span>
          ):(
            <ul className='flex flex-col flex-1 gap-9 w-full '>
           {posts.map((post)=>(
            <PostCard post={post} key={post.$id}/>
           ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home