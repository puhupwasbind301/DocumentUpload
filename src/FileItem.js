import React from "react";
import FileItem from "./FileItem";
import { FiUpload } from "react-icons/fi";

function FileList({ files, onRemoveFile, onPreviewFile }) {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <FiUpload className="mx-auto text-gray-400 mb-3" size={24} />
        <p className="text-gray-500 font-medium">No files uploaded yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Upload files to see them listed here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700">
          Uploaded Files ({files.length})
        </h3>
        <span className="text-xs text-gray-500">
          Click on a file to preview
        </span>
      </div>
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
            onPreview={onPreviewFile}
          />
        ))}
      </ul>
    </div>
  );
}

export default FileList;
