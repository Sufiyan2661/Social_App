import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../lib/appwrite/api";



export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

const AuthContext = createContext(INITIAL_STATE);




export const AuthProvider = ({children}) =>{
  const navigate = useNavigate()
  const [user,setUser] = useState(INITIAL_USER)
  const [isAuthenticated,setIsAuthenticated] = useState(false)
  const [isLoading,setIsLoading] = useState(false)

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
  
        return true;
      }
  
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in");
    }

    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  }


return(
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
)
}
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;


// const formatDate = (dateString)=>{
//   const currentDate = new Date()
//   const inputDate = new Date(dateString)

//   const timeDifference = currentDate - inputDate

//   const secondDifference = timeDifference / 1000

//   if(secondDifference < 60){
//     return `${Math.floor(secondDifference)} second ago`
//   }else if(secondDifference < 3600){
//     const minutes = Math.floor(secondDifference/60)
//     return `${minutes} ${minutes === 1 ? 'minute': 'minutes'  } ago`
//   }else if(secondDifference < 86400){
//     const hours = Math.floor(secondDifference / 3600)
//     return `${hours} ${hours === 1 ? 'hour': 'hours'} ago`
//   } else{
//     const days = Math.floor(secondDifference / 86400)
//     return `${days} ${days === 1 ? 'day':'days'} ago`
//   }

// }
