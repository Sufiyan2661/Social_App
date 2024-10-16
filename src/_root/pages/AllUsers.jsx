import React from "react";
import { useGetUsers } from "../../lib/react-query/queries";
import { Loader } from "react-feather";
import UserCard from "../../components/shared/UserCard";
import { useAuth } from "../../utils/AuthContext";

const Allusers = () => {
  const { user } = useAuth();
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  console.log("Logged in user:", user) 
  console.log("All users (creators):", creators?.documents)

  
  if (isErrorCreators) {
    alert("something went wrong");
  }
  return (
    <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-start w-full pl-6 gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold">All users</h2>

        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl">
            {creators?.documents
              .filter(creator => {
                return creator.$id !== user.id 
              })
              .map((creator) => (
                <li key={creator?.$id} className='flex-1 min-w-[240px]'>
                  <UserCard users={creator} />
                </li>
              ))
            }
          </ul>
        )}
      </div>
    </div>
  );
};

export default Allusers;
