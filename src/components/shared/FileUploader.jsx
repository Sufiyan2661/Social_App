import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({ fieldChange, mediaUrl }) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  // console.log("File path:",'/assets/Icon/file-upload.svg')

  return (
    <div {...getRootProps()} className="flex justify-center items-center flex-col bg-dark-3 rounded-xl cursor-pointer ">
    <input {...getInputProps()} className="cursor-pointer"/>
    {
      fileUrl ? (<>
        <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
          <img src={fileUrl}
           alt="image"
           className="h-80 lg:h-[480px] w-full rounded-[24px] object-cover object-top" />
        </div>
           <p className="text-light-4 text-center small-regular w-full p-4 border-t border-t-dark-4">Click or drag photo to replace</p> 
           </>
      ):(
        // File Uploader
        <div  className="flex items-center justify-center flex-col p-7 h-80 lg:h-[612px]">
         <img src="/assets/Icon/file-upload.svg"
         width={96}
         height={77}
          alt="file-uploader"
           />
           <h3 className="text-[16px] font-medium leading-[140%] text-light-2 mb-2 mt-6">Drag Photo here</h3>
           <p className="text-light-4 text-[14px] font-normal leading-[140%]">SVG, PNG, JPG</p>

           <button className="h-12 items-center rounded-lg bg-dark-4 px-5 text-light-1 flex gap-2 mt-3">Select from computer</button>
          </div>
      )
    }
  </div>
  );
};

export default FileUploader;
