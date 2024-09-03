import React, { useState } from 'react'
import { useAuth } from '../../utils/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const SigninForm = () => {

  const navigate = useNavigate()
  const {createUserAccount,checkAuthUser,signInAccount,isLoading:isUserLoading} = useAuth()
  
  const [credentials,setCredentials] = useState({
    name:"",
    email:"",
    password1:"",
    password2:""
  })



  const handleSingup = async(e)=>{
    e.preventDefault()

    try{
    
      const session = await signInAccount({
        email:credentials.email,
        password:credentials.password1,
      })

      if(!session){
        alert("Something went wrong please login your new account")
        navigate('/sign-in')
        return
      }

      const isLoggedIn = await checkAuthUser()

      if(isLoggedIn){
        navigate('/')
      }else{
        alert("Login failed please try again")

        return
      }

    }catch(error){
      console.log(error)
    }
  }

  const handleOnChange = (e) =>{
    let name = e.target.name
    let value = e.target.value

    setCredentials({...credentials,[name]:value})
  }


  return (
    <div className=" text-white w-full h-screen flex items-center justify-center ">
    <div className="w-80 h-[20rem] border border-neutral-700 shadow-2xl rounded-2xl flex flex-col ">
      <h1 className="md:font-bold text-white text-center py-4 cursor-default">
        Log in to your account
      </h1>
      <form onSubmit={handleSingup} className="flex flex-col items-center space-y-6">
        
        <div className="flex flex-col">
          <label htmlFor="" className="pb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            required
            onChange={handleOnChange}
            className="border bg-zinc-900 text-white rounded-md border-indigo-950 "
          />
        </div>
        {/* input for Password */}
        <div className="flex flex-col">
          <label htmlFor="" className="pb-2">
            Password
          </label>
          <input
            type="password"
            name="password1"
            value={credentials.password1}
            required
            onChange={handleOnChange}
            className="border bg-zinc-900 text-white rounded-md border-indigo-950 "
          />
        </div>
       
       
        <div>
          <input
            type="submit"
            value="Signin"
            className="border bg-primary-500 hover:bg-primary-500 text-light-1 gap-2  rounded-md w-16 "
          />
        </div>
      </form>
      <div className="text-center py-4">
        <p className="cursor-default">
        Don`t have an acoount? SignUp{" "}
          <Link to="/sign-up" className="text-blue-600 hover:underline">
            here
          </Link>
        </p>
      </div>
    </div>
  </div> 
  )
}

export default SigninForm