import React, { useState } from "react";
import FileUploader from "../shared/FileUploader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { useCreatePost, useUpdatePost } from "../../lib/react-query/queries";
import { getFilePreview, uploadFile } from "../../lib/appwrite/api";


const PostForm = ({ post, action }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // console.log("Post Prop:",post?.imageUrl)
  // console.log("action if postform:",action)

  // Query
  const {mutateAsync: createPost,isLoading:isLoadingCreate} = useCreatePost()
  const {mutateAsync: updatePost,isLoading:isLoadingUpdate} = useUpdatePost()



  const [formValues, setFormValues] = useState({
    caption: post ? post.caption : "",
    file: [],
    location: post ? post.location : "",
    tags: post ? post.tags.join(",") : "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    try {

      let fileUrl = post?.imageUrl
      if(formValues.file.length > 0){
        const uploadedFile  = await uploadFile(formValues.file[0])
        fileUrl =  (await getFilePreview(uploadedFile.$id)).href
        console.log("file url in postform",fileUrl)
      }


      // ACTION = UPDATE
      if(post && action === 'Update'){
        const updatedPost = await updatePost({
          ...formValues,
          postId:post.$id,
          imageId:post?.imageId,
          imageUrl: fileUrl
        })
        if(!updatedPost){
          alert("Failed to update post.Please try again.")
        }else{
           navigate(`/posts/${post.$id}`)
        }
        return
        
      }

      // console.log(formValues)
      // ACTION CREATE
      const newPost = await createPost({
        ...formValues,
        userId: user.id,
      });

      // console.log("New post in post from:", newPost);

      if (!newPost) {
        alert("Please try again.");
      }else{
        navigate("/");
      }
    } catch (error) {
    console.log(error)
    }


  };

  const fileChange = (files) => {
    console.log("file has been changed:", files);
    setFormValues((prevValues) => ({
      ...prevValues,
      file: files,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  
  

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-9 w-full max-w-5xl"
    >
      <div>
        <label className=" text-white">Caption</label>
        <textarea
          name="caption"
          value={formValues.caption || ""}
          onChange={handleInputChange}
          className="h-36 w-full bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 custom-scrollbar  "
        />
        <p className=" text-red"></p>
      </div>

      <div>
        <label className="text-white">Add Photos</label>
        <FileUploader fieldChange={fileChange} mediaUrl={post?.imageUrl} />
        <p className="text-red"></p>
      </div>

      <div>
        <label className="text-white">Add Location</label>
        <input
          type="text"
          name="location"
          value={formValues.location || ""}
          onChange={handleInputChange}
          className="h-12 w-full bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3"
        />
        <p className="text-red"></p>
      </div>

      <div className="">
        <label className="text-white">
          Add tags (seperated by commas ", ")
        </label>
        <input
          type="text"
          name="tags"
          value={formValues.tags || ""}
          onChange={handleInputChange}
          placeholder="Art, Expression, Learn"
          className="h-12 w-full bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3"
        />
        <p className="text-white"></p>
      </div>

      <div className="flex gap-4 items-center justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-12  bg-dark-4 px-5 text-light-1 flex gap-2 items-center rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`h-12 px-5 items-center rounded-lg ${isLoadingCreate || isLoadingUpdate ? 'bg-gray-400 cursor-not-allowed':'bg-primary-500 hover:bg-primary-500'}  text-light-1 flex gap-2 whitespace-nowrap`}
          disabled={isLoadingCreate || isLoadingUpdate}
        >
          {isLoadingCreate || isLoadingUpdate ? 'submitting...':'Submit'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
