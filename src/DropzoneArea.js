import React from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: maxFiles,
  });

  return (
    <section
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ease-in-out
        ${
          isDragActive
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }
        cursor-pointer mb-6`}
      aria-labelledby="upload-area-title"
    >
      <input {...getInputProps()} />
      <FiUpload className="mx-auto mb-4 text-gray-500" size={36} />
      <p className="text-lg font-medium text-gray-700">
        {isDragActive
          ? "Drop the files here, we are ready!"
          : "Drag and drop files here, or click to browse"}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        We can upload up to {maxFiles} files (PDF, DOCX, TXT, PNG, JPG)
      </p>
    </section>
  );
}

export default DropzoneArea;
