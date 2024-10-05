import React from "react";
import { useAuth } from "../../utils/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader } from "react-feather";
import GridPostList from "../../components/shared/GridPostList";
import PostStats from "../../components/shared/PostStats";
import {
  useDeletePost,
  useGetPostById,
  useGetUserPosts,
} from "../../lib/react-query/queries";
import { formatDate } from "../../utils/utils";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const { data: post, isLoading } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const handleDeletePost = async () => {
    try {
      console.log("Attempting to delete post with id", id);
       await deletePost({ postId: id, imageId: post?.imageId });
      console.log("Post deleted successfully");
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // post details container
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center"> 
      <div className="hidden md:flex max-w-5xl w-full">
        <button
          onClick={() => navigate(-1)}
          // shad buton ghost
          className="flex gap-4 items-center justify-center hover:bg-transparent hover:text-white"
        >
          <img
            src={"/assets/Icon/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        // post details card
        <div className="bg-dark-2 w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border border-dark-4 xl:rounded-l-[24px]">
          <img
            src={post?.imageUrl}
            alt="creator"
            // post details img
            className="h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none object-cover p-5 bg-dark-1"
          />

          {/* post detail info */}
          <div className="bg-dark-2 flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]">
            <div className="flex justify-between items-center w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex justify-center items-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {formatDate(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex justify-center items-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src={"/assets/Icon/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <button
                  onClick={handleDeletePost}
                  className={`p-0 flex gap-3 hover:bg-transparent hover:text-light-1  text-light-1 small-medium lg:base-medium ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  <img
                    src={"/assets/Icon/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag, index) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
