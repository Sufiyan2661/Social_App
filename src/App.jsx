import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import SigninFrom from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import Home from './_root/pages/Home'
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from './_root/RootLayout'
import { Allusers, CreatePost, EditPost, Explore, PostDetails, Profile, Saved, UpdateProfile } from "./_root/pages";
import Message from "./_root/pages/Message";



function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninFrom />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private Routes */}
        <Route element={<RootLayout/>}>
        <Route index element={<Home />} />
        <Route path="/explore" element={<Explore/>}/>
        <Route path="/saved" element={<Saved/>}/>
        <Route path="/all-users" element={<Allusers/>}/>
        <Route path="/create-post" element={<CreatePost/>}/>
        <Route path="/update-post/:id" element={<EditPost/>}/>
        <Route path="/posts/:id" element={<PostDetails/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
        <Route path="/update-profile/:id" element={<UpdateProfile/>}/>
        <Route path="/message/:id" element={<Message/>}/>
        </Route>
      </Routes>
    </main>
  );
}

export default App;
