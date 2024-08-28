import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import SigninFrom from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import Home from './_root/pages/Home'
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from './_root/RootLayout'


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
        </Route>
      </Routes>
    </main>
  );
}

export default App;
