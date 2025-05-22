import React from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiImage, FiFileText } from "react-icons/fi";

const acceptedFileTypes = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

function DropzoneArea({ onDrop, maxFiles }) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: maxFiles,
    noClick: true, // Disable click-to-open on entire dropzone
  });

  return (
    <div className="max-w-3xl mx-auto">
      <section
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        aria-labelledby="dropzone-title"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <button
            type="button"
            onClick={open}
            className="p-4 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200
                      border border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
            aria-label="Open file dialog"
          >
            <FiUpload
              className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
              size={36}
            />
          </button>
          <div>
            <h2
              id="dropzone-title"
              className="text-lg font-medium text-gray-700"
            >
              {isDragActive ? "Drop your files here" : "Drag files here"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              or click the upload icon above
            </p>
            <p className="text-xs text-gray-400 mt-3">
              Supported formats: PDF, DOCX, TXT, PNG, JPG (Max {maxFiles} files)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DropzoneArea;
