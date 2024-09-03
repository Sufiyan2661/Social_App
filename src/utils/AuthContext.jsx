import { createContext, useContext, useEffect, useState } from "react";
import {
  acccount,
  appwriteConfig,
  avatars,
  databases,
  storage,
} from "../lib/appwrite/config";
import { ID, Query } from "appwrite";
import { useNavigate } from "react-router-dom";

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

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const signInAccount = async (credentials) => {
    try {
      const session = await acccount.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );

      return session;
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const currentAccount = await acccount.get();

      if (!currentAccount) Error("No Current Account fount");

      const CurrentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );

      if (!CurrentUser || !CurrentUser.documents[0])
        throw Error("User not Fount");

      return CurrentUser.documents[0];
    } catch (error) {}
  };

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
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === null
    )
      navigate("/sign-in");

    checkAuthUser();
  }, []);

  const SignOut = async () => {
    try {
      const session = await acccount.deleteSession("current");

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // create post

  const createPost = async (post) => {
    try {
      // Ensure that post.file is not empty
      if (!post.file || post.file.length === 0) {
        throw new Error("No file Provided.");
      }

      // upload image to storage

      const upLoadedFile = await uploadFile(post.file[0]);

      if (!upLoadedFile) throw Error("having issue in uploading file");

      // Get file url

      const fileUrl =  getFilePreview(upLoadedFile.$id);

    

      if (!fileUrl || typeof fileUrl !== "string" || fileUrl.length > 2000) {
        deleteFile(upLoadedFile.$id);
        throw new Error("Invalid file URL");
      }

      // convert tags into an array

      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      // Save post to database
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: upLoadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );

      if (!newPost) {
        await deleteFile(upLoadedFile.$id);
        throw new Error("Failed t create new post");
      }

      return newPost;


    } catch (error) {
      console.log(error.massage);
      throw error
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);

      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFile = async (file) => {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );

      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  };

  const getFilePreview =  (fileId) => {
    try {
      const fileUrl =  storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );

      console.log("Genenrated file URl:",fileUrl)

      return fileUrl.href;
    } catch (error) {
      console.log(error);
    }
  };



  const getRecentPosts = async()=>{
    
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt',Query.limit(20))]
      )

      if(!posts) throw new Error("Having problem in listing the posts")
        return posts
    } catch (error) {
      console.log(error.massage)
      throw error
    }
  }

const formatDate = (dateString)=>{
  const currentDate = new Date()
  const inputDate = new Date(dateString)

  const timeDifference = currentDate - inputDate

  const secondDifference = timeDifference / 1000

  if(secondDifference < 60){
    return `${Math.floor(secondDifference)} second ago`
  }else if(secondDifference < 3600){
    const minutes = Math.floor(secondDifference/60)
    return `${minutes} ${minutes === 1 ? 'minute': 'minutes'  } ago`
  }else if(secondDifference < 86400){
    const hours = Math.floor(secondDifference / 3600)
    return `${hours} ${hours === 1 ? 'hour': 'hours'} ago`
  } else{
    const days = Math.floor(secondDifference / 86400)
    return `${days} ${days === 1 ? 'day':'days'} ago`
  }

}





  

  const contextData = {
    user,
    isLoading,
    setIsLoading,
    createUserAccount,
    signInAccount,
    checkAuthUser,
    SignOut,
    createPost,
    getRecentPosts,
    formatDate,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
