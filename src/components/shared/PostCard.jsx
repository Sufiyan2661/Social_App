import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import PostStats from "./PostStats";
import { formatDate } from "../../utils/utils";

const PostCard = ({ post }) => {
  const {  user } = useAuth();

  // console.log(post);

  if (!post.creator) return;

  return (
    // post-card
    <div id="post-card" className="bg-dark-2 w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-col border border-dark-4 xl:rounded-l-[24px]">
      <div className="flex justify-between  items-center">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageUrl ||
                "/assets/Icon/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex items-center justify-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatDate(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"} `}
        >
          <img src="/assets/Icon/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag) => (
              <li key={tag} className="text-light-3">
              
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/Icon/profile-placeholder.svg"}
          className="h-64 xs:h-[400px] lg:h-[450px] w-full rounded-[24px] object-cover mb-5"
          alt="post image"
        />
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
