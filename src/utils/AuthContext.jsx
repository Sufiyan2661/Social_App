import { createContext, useContext, useEffect, useState } from "react";
import {
  acccount,
  appwriteConfig,
  avatars,
  databases,
} from "../lib/appwrite/config";
import { ID, Query } from "appwrite";
import { useNavigate } from "react-router-dom";



export const INITIAL_USER = {
    id:'',
    name:'',
    username:'',
    email:'',
    imageUrl:'',
    bio:'',
}

const INITIAL_STATE = {
    user:INITIAL_USER,
    isLoading:false,
    isAuthenticated:false,
    setUser:()=>{},
    setIsAuthenticated:()=>{},
    checkAuthUser:async()=> false,
}

const AuthContext = createContext(INITIAL_STATE);

export const AuthProvider = ({ children }) => {
 
    const navigate = useNavigate()
    const [user,setUser] = useState(INITIAL_USER)
    const [isLoading,setIsLoading] = useState(false)
    const [isAuthenticated,setIsAuthenticated] = useState(false)



  const createUserAccount = async (credentials) => {
   

    if (credentials.password1 !== credentials.password2) {
      alert("password Do not match");
      return;
    }

    try {
      const newAccount = await acccount.create(
        ID.unique(),
        credentials.email,
        credentials.password1,
        credentials.name
      );
      if (!newAccount) throw Error("Account Creation failed!");

      const avatarUrl = avatars.getInitials(newAccount.name);

      const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        imageUrl: avatarUrl,
      });

      return newAccount;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const saveUserToDB = async (user) => {
    try {
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user
      );
      console.log("newUser:", newUser);
      return newUser;
    } catch (error) {
      console.log(error);
    }
  };

  const signInAccount = async (credentials)=>{
    

    try {
        const session = await acccount.createEmailPasswordSession(credentials.email,credentials.password)
        
        return session
    } catch (error) {
        console.log(error)
    }
  }


  const getCurrentUser = async () =>{
    try {
        const currentAccount = await acccount.get()

        if(!currentAccount) Error("No Current Account fount")

        const CurrentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!CurrentUser || !CurrentUser.documents[0]) throw Error("User not Fount")


        return CurrentUser.documents[0]
        
    } catch (error) {
        
    }
  }




  const checkAuthUser = async ()=>{
    setIsLoading(true)
    try {
        const currentAccount = await getCurrentUser()

        if(currentAccount){
            setUser({
                id:currentAccount.$id,
                name:currentAccount.name,
                username:currentAccount.username,
                email:currentAccount.email,
                imageUrl:currentAccount.imageUrl,
                bio:currentAccount.bio,
            })
            setIsAuthenticated(true)

            return true
        }

        return false

    } catch (error) {
        console.log(error)
        return false
    }finally{
        setIsLoading(false)
    }
  }


  useEffect(()=>{
    if(localStorage.getItem('cookieFallback')=== '[]'||
    localStorage.getItem('cookieFallback') === null
    ) navigate('/sign-in')


    checkAuthUser()
  },[])





  const contextData = {
    user,
    isLoading,
    createUserAccount,
    signInAccount,
    checkAuthUser,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
