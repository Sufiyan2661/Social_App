import React from 'react'
import TopBar from '../components/shared/TopBar'
import LeftSideBar from '../components/shared/LeftSideBar'
import { Outlet } from 'react-router-dom'
import BottomBar from '../components/shared/BottomBar'

const RootLayout = () => {
  return (
    <div className='w-full md:flex text-white'>
      <TopBar/>
      <LeftSideBar/>

      <section className='flex flex-1 h-full'>
        <Outlet/>
      </section>

      <BottomBar/>
    </div>
  )
}

export default RootLayout