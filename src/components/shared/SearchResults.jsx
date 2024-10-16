import React from 'react'
import { Loader } from 'react-feather'
import GridPostList from './GridPostList'

const SearchResults = ({issearchFetching,searchedPosts}) => {
  if(issearchFetching) return <Loader className='flex items-center justify-center w-full'/>

  if(searchedPosts && searchedPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchedPosts.documents}/>
    )
  }
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchResults