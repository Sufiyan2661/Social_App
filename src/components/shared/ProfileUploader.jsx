import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone';

const ProfileUploader = ({fieldChange,mediaUrl}) => {
    const [file,setFile] = useState([])
    const [fileUrl,setFileUrl] = useState(mediaUrl)

    const onDrop = useCallback(
        (acceptedFiles) => {
          setFile(acceptedFiles);
          setFileUrl(URL.createObjectURL(acceptedFiles[0]));
          fieldChange(acceptedFiles);
        },
        [file]
      );
    
      const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
          "image/*": [".png", ".jpeg", ".jpg", ".svg"],
        },
      });
  return (
    <div {...getRootProps()} className='flex items-center justify-center   '>
        <input {...getInputProps()} className=' cursor-pointer px-3 text-blue-500'  />

        <div className="cursor-pointer flex items-center justify-center gap-4">

            <img src={fileUrl || "/assets/Icon/profile-placeholder.svg"}
             alt="image"
             className='h-24 w-24 rounded-full object-cover object-top'
              />
              <p className="text-primary-500 small-regular md:base-semibold">Change Profile Photo</p>
        </div>
    </div>
  )
}

export default ProfileUploader