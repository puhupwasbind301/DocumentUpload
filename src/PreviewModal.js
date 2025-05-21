import React from "react";
import { FiXCircle } from "react-icons/fi";

function PreviewModal({ isOpen, content, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-modal-title"
      >
        <h3
          id="preview-modal-title"
          className="text-xl font-bold mb-4 border-b pb-2"
        >
          File Preview
        </h3>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close preview"
        >
          <FiXCircle size={24} />
        </button>
        <div className="flex-grow overflow-auto flex items-center justify-center">
          {content}
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
