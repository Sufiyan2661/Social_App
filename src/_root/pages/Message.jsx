import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import {
  useCreateMassage,
  useDeleteMassage,
  useGetMassages,
  useGetUsers,
} from "../../lib/react-query/queries";
import { Loader, Trash2 } from "react-feather";
import { formatMassageTime } from "../../utils/utils";
import { appwriteConfig, client } from "../../lib/appwrite/config";
import { useParams } from "react-router-dom";

const Message = () => {
  const { user } = useAuth();
  const {data:creators} = useGetUsers()

  const { id: chatUserId } = useParams();
  const { data: massages, isLoading, refetch } = useGetMassages();
  const { mutate: createMassage } = useCreateMassage();
  const { mutate: deleteMassage } = useDeleteMassage();
  const [massageBody, setMassageBody] = useState("");

  const bottemRef = useRef(null);
  //  Scroll to the bottom every time massage updated
  useEffect(() => {
    if (massages && bottemRef.current) {
      bottemRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [massages]);

  // Real-time updates for the new or deleted massages
  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollection}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          refetch(); // Refetch messages to update the UI
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          refetch(); // Refetch messages to update the UI
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [refetch]);

  const handleCreate = (e) => {
    e.preventDefault();

    createMassage({ user, chatUserId, massageBody });
    setMassageBody("");
  };

  const handleDelete = (massageId) => {
    deleteMassage(massageId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

// Attempt to find the receiver


const receiver = creators?.documents.find((creator) => creator.$id === chatUserId) || null;

// Log the receiver's name if it exists
console.log('Receiver Name:', receiver?.name);





  

  return (
    <main className=" w-full ml-[270px] flex flex-1 flex-col h-screen bg-gray-950 bg-fixed bg-cover text-white">
      {/* Header */}
      <div className="flex w-full bg-gray-800 h-14 text-white  items-center ">
        <h2>{receiver ? receiver.name: "chat"}</h2>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Filter messages by userId to show only messages between the current user and selected chat user */}
          {massages
            ?.filter(
              (massage) =>
                (massage.user_id === user.id &&
                  massage.receiverId === chatUserId) ||
                (massage.receiverId === user.id &&
                  massage.user_id === chatUserId)
            )
            .map((massage) => {
              return (
                <div
                  key={massage.$id}
                  className={`flex ${
                    massage.user_id === user.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 max-w-xs rounded-lg ${
                      massage.user_id === user.id
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-300 text-black self-start"
                    }`}
                  >
                    <p className="text-sm font-semibold"></p>
                    <p className="mt-1">
                      {massage.body ? massage.body : "Body not found"}
                    </p>
                    <p className="text-sm font-semibold">
                      <small className="ml-2">
                        {formatMassageTime(massage.$createdAt)}
                      </small>
                    </p>
                    {massage.user_id === user.id &&
                      massage.$permissions.includes('delete("users")') && (
                        <Trash2
                          onClick={() => handleDelete(massage.$id)}
                          className="hover:text-red-700 text-xs mt-1"
                          size={16}
                        />
                      )}
                  </div>
                </div>
              );
            })}

          {/* Empty div to help scroll to the bottom */}
          <div ref={bottemRef}></div>
        </div>

        {/* Message input form */}
        <form
          onSubmit={handleCreate}
          className="p-4 border-t bg-white flex items-center sticky bottom-0 w-full"
        >
          <div className="flex-1 mr-2">
            <textarea
              required
              maxLength="1000"
              placeholder="Say something..."
              value={massageBody}
              onChange={(e) => setMassageBody(e.target.value)}
              className="flex-1 p-2 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-full"
            ></textarea>
          </div>
          <div>
            <input
              type="submit"
              value="Send"
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>
    </main>
  );
};

export default Message;
