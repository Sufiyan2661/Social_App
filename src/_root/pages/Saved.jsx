import React from "react";
import { useGetCurrentUser } from "../../lib/react-query/queries";
import { Loader } from "react-feather";
import GridPostList from "../../components/shared/GridPostList";

const Saved = () => {
  const { data: currentUser, isLoading } = useGetCurrentUser();

  console.log("Save post structure:", currentUser);

  console.log("currentUser.save:", currentUser?.save);

  const savePosts = currentUser?.save
    ?.filter((savePost) => savePost?.posts) // Filter out any undefined or null posts
    .map((savePost) => ({
      ...savePost.posts, // Access the post details within savePost
      imageUrl: savePost.posts?.imageUrl, // The post image URL
      creator: {
        imageUrl: currentUser.imageUrl, // Creator image URL from currentUser
        name: currentUser.name, // Creator name from currentUser
      },
    }))
    .reverse();

  // const savePosts = currentUser?.save.map((savePost)=>({
  //   ...savePost.post,
  //   imageUrl: savePost.post.imageUrl,
  //   creator:{
  //     imageUrl:currentUser.imageUrl,
  //     name:currentUser.name
  //   },
  // })).reverse()

  console.log("Save posts:", savePosts);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="flex gap-2 w-full max-w-5xl pl-6">
        <img
          src="/assets/Icon/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert brightness-0 transition"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Post</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9 pl-6">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
