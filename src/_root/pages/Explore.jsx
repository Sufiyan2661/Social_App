import React, { useCallback, useEffect, useState } from "react";
import SearchResults from "../../components/shared/SearchResults";
import GridPostList from "../../components/shared/GridPostList";
import { useAuth } from "../../utils/AuthContext";
import { Loader } from "react-feather";
import { useInView } from "react-intersection-observer";
import useDebounce from "../../Hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "../../lib/react-query/queries";

const searchResults = ({issearchFetching,searchedPosts}) =>{
  if(issearchFetching){
    return <Loader/>
  }else if(searchedPosts && searchedPosts.documents.length > 0){
    return <GridPostList posts={searchedPosts.documents}/>
  }else{
    return (
      <p className="text-light-4 mt-10 text-center w-full">No resluts Found</p>
    )
  }
}

const Explore = () => {
  const {ref,inView} = useInView()
  const {data:posts,fetchNextPage,hasNextPage} = useGetPosts()
  const [searchValue,setSearchValue] =useState("")
  const debouncedSearch = useDebounce(searchValue,500)
  const {data:searchedPosts,isFetching:issearchFetching} = useSearchPosts(debouncedSearch)

  useEffect(()=>{

  },[inView,searchValue])

  if(!posts){
    return(
      <div className="flex items-center justify-center w-full h-full">
        <Loader/>
      </div>
    )
  }

  const shouldShowSearchResult = searchValue !== ""
  const shouldShowPosts = !shouldShowSearchResult && posts.pages.every((item) => item.documents.length === 0)
  

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold">Search Post</h2>
        <div className="flex  gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/Icon/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <input
            type="text"
            placeholder="Search"
            className=" w-full h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0 "
            value={searchValue}
            onChange={(e) =>{ const {value} = e.target;
             setSearchValue(value)}}
          />
        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-5xl mt-6 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex items-center justify-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/Icon/filter.svg"
            height={20}
            width={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResult ? (
          <SearchResults
          issearchFetching={issearchFetching}
          searchedPosts={searchedPosts} />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
         posts.pages.map((item,index)=>(
          <GridPostList key={`page-${index}`} posts={item.documents}/>
         ))
        )}
      </div>
      {/* {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )} */}
    </div>
  );
};

export default Explore;
