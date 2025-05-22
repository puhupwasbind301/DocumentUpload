import { useState, useCallback, useEffect } from "react";
import DropzoneArea from "./DropzoneArea";
import FileList from "./FileList";
import PreviewModal from "./PreviewModal";
import ErrorMessage from "./ErrorMessage";

const MAX_FILES_LIMIT = 5;

export default function DocumentUpload() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      // Clean up object URLs
      files.forEach((file) => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [files]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setError("");
      const filesToProcess = [];

      for (const entry of acceptedFiles) {
        if (entry.kind === "file" && typeof entry.getFile === "function") {
          try {
            const file = await entry.getFile();
            filesToProcess.push(file);
          } catch (err) {
            console.error("Error getting file from handle:", err);
            setError(`Failed to read file: ${entry.name || "unknown"}`);
          }
        } else if (entry instanceof File) {
          filesToProcess.push(entry);
        } else {
          console.warn("Unexpected entry type in acceptedFiles:", entry);
          setError("An unsupported file type was dropped.");
        }
      }

      const currentTotalFiles = files.length;
      const newFilesCount = filesToProcess.length;

      if (currentTotalFiles + newFilesCount > MAX_FILES_LIMIT) {
        setError(
          `Maximum ${MAX_FILES_LIMIT} files allowed. You have ${currentTotalFiles}, trying to add ${newFilesCount} more.`
        );
        return;
      }

      const acceptedFileTypesExtensions = [
        ".pdf",
        ".docx",
        ".txt",
        ".png",
        ".jpg",
        ".jpeg",
      ];
      const validFiles = filesToProcess.filter((file) => {
        const fileExt = file.name.split(".").pop().toLowerCase();
        return acceptedFileTypesExtensions.includes(`.${fileExt}`);
      });

      if (validFiles.length !== filesToProcess.length) {
        const invalidFilesCount = filesToProcess.length - validFiles.length;
        setError(
          `${invalidFilesCount} file(s) not supported. Only PDF, DOCX, TXT, PNG, JPG allowed.`
        );
      }

      const newFiles = validFiles.map((file) => {
        const fileObject = {
          ...file,
          processing: true,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        if (file.type?.startsWith("image/")) {
          fileObject.previewUrl = URL.createObjectURL(file);
        }
        return fileObject;
      });

      setFiles((prev) => [...prev, ...newFiles]);

      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            newFiles.some((nf) => nf.id === f.id)
              ? { ...f, processing: false }
              : f
          )
        );
      }, 1500);
    },
    [files]
  );

  const removeFile = (fileToRemoveId) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === fileToRemoveId);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      return prev.filter((file) => file.id !== fileToRemoveId);
    });
  };

  const handleFilePreview = (file) => {
    const fileExt = file.name.split(".").pop().toLowerCase();

    if (file.type?.startsWith("image/")) {
      setPreviewContent(
        <div className="flex items-center justify-center p-4">
          <img
            src={file.previewUrl}
            alt="Preview"
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-md"
          />
        </div>
      );
      setIsPreviewModalOpen(true);
    } else if (file.type === "text/plain" || fileExt === "txt") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewContent(
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-mono max-h-[70vh] overflow-y-auto p-4 bg-white rounded border border-gray-200">
              {e.target.result}
            </pre>
          </div>
        );
        setIsPreviewModalOpen(true);
      };
      reader.readAsText(file);
    } else {
      setPreviewContent(
        <div className="text-center p-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Preview Not Available
          </h3>
          <p className="text-gray-500">
            We can't preview {fileExt || file.type || "this file type"}.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Supported previews: images and text files
          </p>
        </div>
      );
      setIsPreviewModalOpen(true);
    }
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewContent(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black">
      <div className="bg-blue rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h1 className="text-3xl font-bold mb-2">Document Upload</h1>
          <p className="opacity-90">
            Upload your documents and preview them instantly
          </p>
        </div>

        <div className="p-8">
          <DropzoneArea onDrop={onDrop} maxFiles={MAX_FILES_LIMIT} />

          <ErrorMessage
            message={error}
            onClose={() => setError("")}
            className="mt-4"
          />

          <section className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-blue-800">
                Your Uploads
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {files.length} of {MAX_FILES_LIMIT} files
              </span>
            </div>

            <FileList
              files={files}
              onRemoveFile={removeFile}
              onPreviewFile={handleFilePreview}
            />
          </section>
        </div>
      </div>

      <PreviewModal
        isOpen={isPreviewModalOpen}
        content={previewContent}
        onClose={closePreviewModal}
      />
    </div>
  );
}
