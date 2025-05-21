import React from "react";
import { FiFile, FiImage, FiFileText, FiTrash2 } from "react-icons/fi";
import { FaFilePdf, FaFileWord } from "react-icons/fa";

const fileIcons = {
  pdf: <FaFilePdf className="text-red-500" size={24} />,
  docx: <FaFileWord className="text-blue-500" size={24} />,
  txt: <FiFileText className="text-gray-500" size={24} />,
  png: <FiImage className="text-green-500" size={24} />,
  jpg: <FiImage className="text-green-500" size={24} />,
  jpeg: <FiImage className="text-green-500" size={24} />,
};

function getFileIcon(fileName) {
  const ext = fileName?.split(".").pop().toLowerCase();
  return fileIcons[ext] || <FiFile size={24} />;
}

function FileItem({ file, onRemove, onPreview }) {
  return (
    <li className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-md">
      <div className="flex items-center min-w-0 flex-1">
        <span
          onClick={() => onPreview(file)}
          className="cursor-pointer flex-shrink-0"
        >
          {getFileIcon(file.name)}
        </span>
        <div className="ml-4 flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate" title={file.name}>
            {file.name}
          </p>
          {file.processing ? (
            <div className="flex items-center mt-1">
              <div className="w-24 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-400 h-2.5 rounded-full animate-pulse-width"></div>
              </div>
              <span className="ml-3 text-sm text-gray-500">Processing...</span>
            </div>
          ) : (
            <p className="text-sm text-green-600 mt-1">Upload complete</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onRemove(file.id)}
        className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
        aria-label={`Remove file ${file.name}`}
      >
        <FiTrash2 size={20} />
      </button>

      <style jsx>{`
        @keyframes pulse-width {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
        .animate-pulse-width {
          animation: pulse-width 2s infinite ease-in-out;
        }
      `}</style>
    </li>
  );
}

export default FileItem;
