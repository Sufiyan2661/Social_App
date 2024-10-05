import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useLocation } from "react-router-dom";
import { Loader } from "react-feather";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "../../lib/react-query/queries";




const PostStats = ({ post, userId }) => {
  // console.log("User id in postStats:",userId) // check if userId is passed

  const location = useLocation();
  const likeList = post.likes.map((user) => user.$id);

  const [likes, setLikes] = useState(likeList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();

  const { data: currentUser} = useGetCurrentUser();

  
  // console.log("Current User:",currentUser)
  const savedPostRecord = currentUser?.save.find(
    (record) => record?.posts?.$id === post.$id
  );


  const checkIsLiked = (likeList, userId) => {
    return likeList.includes(userId);
  };

  useEffect(() => {
    
      setIsSaved(!!savedPostRecord);
    
  }, [currentUser]);

  const handleLikePost = (e) => {
    e.stopPropagation();

    let likesArray = [...likes];


// console.log("postId:",post.$id)
// console.log("userId:",userId)
console.log("likesArray:",likesArray)

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((id) => id !== userId);
    } else {
      likesArray.push(userId);
    }

    // console.log("updated likeArray:",likesArray)
    // const updateLikes = likes.includes(userId)? likes.filter((id)=>id !== userId):
    // [...likes,userId]

    setLikes(likesArray);

    likePost({postId:post.$id,likesArray});
  };

  const handleSavePost = async (e) => {
    e.stopPropagation();

    // console.log("userId:", userId, "postId:", post.$id);
      // Find te saved post record
      
      // console.log("save post record in handleSavePost:",savedPostRecord)


      console.log("userId:",userId)
      console.log("postId:",post.$id)
      if (savedPostRecord) {
        setIsSaved(false);
        return deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({userId,postId:post.$id});
      setIsSaved(true);
    }
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/Icon/liked.svg"
              : "/assets/Icon/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e)=>handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2 ">
        <img
          src={`${
            isSaved ? "/assets/Icon/saved.svg" : "/assets/Icon/save.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e)=>handleSavePost(e)}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PostStats;
