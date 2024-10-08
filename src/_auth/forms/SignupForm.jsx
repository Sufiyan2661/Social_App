import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "../../lib/react-query/queries";



const SignupForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useAuth();
  // Queries
  const {mutateAsync: signInAccount, isLoading: isSigningInUser} =useSignInAccount()
  const {mutateAsync: createUserAccoutn , isLoading: isCreatingAccount} = useCreateUserAccount()
 ;

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });



  //
  const handleSingup = async (e) => {
    e.preventDefault();

    try {
    
      const newUser = await createUserAccoutn(credentials);

      if (!newUser) {
        alert("Sign up failed.Please try again.");
        return;
      }

      const session = await signInAccount({
        email: credentials.email,
        password: credentials.password1,
      });

      if (!session) {
        alert("Something went wrong please login your new account");
        navigate("/sign-in");
   
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        navigate("/");
      } else {
        alert("Login failed please try again");
        
        return;
      }
    } catch (error) {
      console.log(error);
  
    }
  };

  const handleOnChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <div className=" text-white w-full h-screen flex items-center justify-center ">
      <div className="w-80 h-[30rem] border border-neutral-700 shadow-2xl rounded-2xl flex flex-col ">
        <h1 className="md:font-bold text-white text-center py-4 cursor-default">
          Create your Account
        </h1>
        <form
          onSubmit={handleSingup}
          className="flex flex-col items-center space-y-6"
        >
          {/* input for Name */}
          <div className="flex flex-col">
            <label className="pb-2">Name</label>
            <input
              type="text"
              name="name"
              value={credentials.name}
              required
              onChange={handleOnChange}
              className="border bg-zinc-900 text-white rounded-md border-indigo-950 "
            />
          </div>
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
          {/* Confirm password */}
          <div className="flex flex-col">
            <label htmlFor="" className="pb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              value={credentials.password2}
              required
              onChange={handleOnChange}
              className="border bg-zinc-900 text-white rounded-md border-indigo-950 "
            />
          </div>
          <div>
            <button
              type="submit"
              className="border bg-primary-500 hover:bg-primary-500 text-light-1 gap-2  rounded-md w-16 "
            >
              {isCreatingAccount || isSigningInUser || isUserLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span>Loading...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
        <div className="text-center py-4">
          <p className="cursor-default">
            Already have an acoount? Signin{" "}
            <Link to="/sign-in" className="text-blue-600 hover:underline">
              here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
