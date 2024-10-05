import { ID, Permission, Query, Role } from "appwrite";
import { appwriteConfig, acccount, databases, storage, avatars } from "./config";
import { data } from "autoprefixer";


// AUTH

// ======================================================

// =====================================================SIGN UP
export async function createUserAccoutn(credentials) {
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
}


// =================================== SAVE USER TO DB
export async function saveUserToDB(user) {
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



// ==================================== SIGN IN
export async function signInAccount(credentials) {
  try {
    const session = await acccount.createEmailPasswordSession(
      credentials.email,
      credentials.password
    );

    return session;
  } catch (error) {
    console.log(error);
  }

}

// ===================================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await acccount.get()
    // console.log("currrent account in the getAccount:",currentAccount)
    return currentAccount
  } catch (error) {
    console.log(error)
  }

}


// ====================================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    // console.log("currentAccount;",currentAccount)

    if (!currentAccount) Error("No Current Account fount");


    // console.log("Current Account:",currentAccount)
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    // console.log("Current Usre:",currentUser)

    if (!currentUser)
      throw Error("User not Fount");

    return currentUser.documents[0];
  } catch (error) {
    console.log(error)
    return null
  }
}

// ==================================== SING OUT
export async function singOutAccount() {
  try {
    const session = await acccount.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
    return false;
  }
}



// =================================================
// POSTS
// =================================================

// ============================================ CREATE POSTS
export async function createPost(post) {
  console.log("post::::", post)
  try {
    // Ensure that post.file is not empty
    if (!post.file || post.file.length === 0) {
      throw new Error("No file Provided.");
    }

    // upload image to storage

    const upLoadedFile = await uploadFile(post.file[0]);
    console.log("Uploaded file:", upLoadedFile)

    if (!upLoadedFile) throw Error("having issue in uploading file");

    // Get file url

    const filePreview = await getFilePreview(upLoadedFile.$id)
    const fileUrl = filePreview.href
    console.log("Generated file Url in the createPost function:", fileUrl)
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

}



// ================================== UPLOAD FILE
export async function uploadFile(file) {
  // console.log("checking file in uploaded file:", file)
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    // console.log("UPLOADED FILE:", uploadedFile)
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }

}


// ============================== GET FILE URL

export async function getFilePreview(fileId) {
  // console.log("Getting the fileId in getfilePreview:", fileId)
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );


    // console.log("Genenrated file URl:", fileUrl)
    if (!fileUrl) throw Error
    return fileUrl;
  } catch (error) {
    console.log(error);
  }

}


// ============================ DELETE FILE
export async function deleteFile(fileId) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }

}


// ============================== GET POSTS
export async function searchPosts(searchTerm) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    )

    if (!posts) throw Error

    return posts

  } catch (error) {
    console.log(error)
  }
}


export async function getInfinitePosts({ pageParam }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(10)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }


  try {
    const posts = await await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )

    if (!posts) throw Error

    return posts

  } catch (error) {
    console.log(error)
  }
}


// ========================================= GET POST BY ID
export async function getPostById(postId) {
  if (!postId) throw Error

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    )
    if (!post) throw Error

    return post
  } catch (error) {
    console.log("Error in getPostById:", error)
  }

}


// ====================================== UPDATE POST
export async function updatePost(post) {

  // console.log("Fiel in the updatePost:",post)


  const hasFileToUpdate = post.file.length > 0

  try {
    // Ensure that post.file is not empty
    // if (!post.file || post.file.length === 0) {
    //   throw new Error("No file Provided.");
    // }

    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,

    }

    if (hasFileToUpdate) {
      // upload new file appwrite strorage
      const upLoadedFile = await uploadFile(post.file[0]);
      if (!upLoadedFile) throw Error("having issue in uploading file");

      // Get new file url
      const fileUrl = await getFilePreview(upLoadedFile.$id);
      if (!fileUrl) {
        deleteFile(upLoadedFile.$id);
        throw Error;

      }

      if (fileUrl.length > 2000) {
        console.log("The file is too long")
      }
      image = { ...image, imageUrl: fileUrl, imageId: upLoadedFile.$id }
      console.log("image object in update post :", image)

    }


    // convert tags into an array

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Save post to database
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been updated recently
      if (hasFileToUpdate) {
        await deleteFile(post.imageId)
      }
      throw Error("No new file uploaded")
    }

    // Safely delete old file after succesful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId)
    }
    return updatedPost;


  } catch (error) {
    console.log(error);
    throw error
  }
}


export async function deletePost(postId, imageId) {
  if (!postId || !imageId) throw Error

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )



    if (!statusCode) throw Error

    return { status: 'ok' }

  } catch (error) {
    console.log(error)
  }

}


// =================================== LIKE UNLIKE POST
export async function likePost(postId, likesArray) {
  console.log(Array.isArray(likesArray));


  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    )

    if (!updatedPost) throw Error("having problem in liking the post")

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

// ============================ SAVE POST
export async function savePost(userId, postId) {
  // console.log(`userId = ${userId} and postId ${postId}`)

  console.log("postId:", postId)
  console.log("userId:", userId)
  try {

    if (!userId || !postId) {
      throw new Error("userId or postId is missing");
    }

    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        users: userId,
        posts: postId
      }
    )

    if (!updatedPost) throw Error("having problem in saving the post")



    return updatedPost
  } catch (error) {
    // console.log(error.massage)
    console.log(error)
  }
}

// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    )

    if (!statusCode) throw Error("having problem in deleting the post")



    return { status: 'ok' }
  } catch (error) {
    console.log(error.massage)
  }

}

// ============================== GET USERS POST
export async function getUserPosts(userId) {
  if (!userId) return

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    )

    if (!post) throw Error

    return post
  } catch (error) {
    console.log(error)
  }
}

// ========================= GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(20))]
    )

    if (!posts) throw new Error("Having problem in listing the posts")
    return posts
  } catch (error) {
    console.log(error)
    throw error
  }
}

// ===================================================================
// USER
// ===================================================================

// ==================================================== GET USERS
export async function getUsers(limit) {
  const queries = [Query.orderDesc("$createdAt")]

  if (limit) {
    queries.push(Query.limit(limit))
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries,
    )
    if (!users) throw Error

    return users

  } catch (error) {
    console.log(error)
  }
}


// ================================== GET USER BY ID
export async function getUserById(userId) {

  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    )

    if (!user) throw Error
    return user

  } catch (error) {
    console.log(error)

  }


}

// ====================================== UPDATE USER
export async function updateUser(user) {
  const hasFileToUpdate = user.file.length > 0

  try {

    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    }


    if (hasFileToUpdate) {
      // Upload new file to appwrite storage

      const uploadedFile = await uploadFile(user.file[0])
      if (!uploadedFile) throw Error

      // Get new file url

      const fileUrl = getFilePreview(uploadedFile.file[0])
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }
      image = { ...image, imageUrl: fileUrl, iamgeId: uploadedFile.$id }
    }

    // Update user

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    )

    // Failed ot update
    if (!updateUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId)
      }
      // if no new file to uploaded ,just throw error
      throw Error
    }

    // Safely delete old file after succesfull update

    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId)
    }

    return updateUser
  } catch (error) {
    console.log(error)
  }
}


// Function to fetch the massages
export async function getMassages() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollection,
      [Query.orderAsc("$createdAt"), Query.limit(20)]
    )
    // console.log(response.documents)
    return response.documents
  } catch (error) {
    console.log(error)
  }
}

// Function to delete the massages
export async function deleteMassage(massage_id) {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollection,
      massage_id
    )
  } catch (error) {
    console.log(error)
  }

}

// Function to create the massages
export async function createMassages(user,chatUserId, massageBody) {
  // console.log("chatuser id  in createMessages:",chatUserId)
  console.log("user in createMassages:", user)
  // console.log("massageBody in createMassages:", massageBody)
  try {
    let payload = {
      user_id: user.id,
      receiverId: chatUserId,
      username: user.name,
      body: massageBody,
    }

    const permissions = [
      // `read(user:${user.id})`,    // Read permission for the specific user
      // `write(user:${user.id})`,   // Write permission for the specific user
      // `delete(user:${user.id})`    // Delete permission for the specific user



      Permission.read(Role.users(user.$id)),    // Correctly using user.id for permissions
      Permission.write(Role.users(user.i$d)),   // Correctly using user.id for permissions
      Permission.delete(Role.users(user.$id)),   // Correctly using user.id for permissions
    ];


    let response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollection,
      ID.unique(),
      payload,
      permissions
    )
    return response
  } catch (error) {
    console.log(error)
  }
}





