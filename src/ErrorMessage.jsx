import React from "react";
import { FiXCircle } from "react-icons/fi";

function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
      role="alert"
    >
      <strong className="font-bold">Oops! </strong>
      <span className="block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">
        <FiXCircle className="h-6 w-6 text-red-500" onClick={onClose} />
      </span>
    </div>
  );
}

export default ErrorMessage;
