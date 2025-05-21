import React from "react";
import FileItem from "./FileItem";

function FileList({ files, onRemoveFile, onPreviewFile }) {
  if (files.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4 border rounded-lg bg-gray-50">
        No files have been uploaded yet.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onRemove={onRemoveFile}
          onPreview={onPreviewFile}
        />
      ))}
    </ul>
  );
}

export default FileList;
