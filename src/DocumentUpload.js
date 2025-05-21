import { useState, useCallback } from "react";
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

  const onDrop = useCallback(
    (acceptedFiles) => {
      setError(""); // Clear previous errors

      const currentTotalFiles = files.length;
      const newFilesCount = acceptedFiles.length;

      if (currentTotalFiles + newFilesCount > MAX_FILES_LIMIT) {
        setError(
          `We can only upload a maximum of ${MAX_FILES_LIMIT} files. We currently have ${currentTotalFiles} files, and we tried to add ${newFilesCount} more.`
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

      const validFiles = acceptedFiles.filter((file) => {
        const fileExt = file.name.split(".").pop().toLowerCase();
        return acceptedFileTypesExtensions.includes(`.${fileExt}`);
      });

      if (validFiles.length !== acceptedFiles.length) {
        const invalidFilesCount = acceptedFiles.length - validFiles.length;
        setError(
          `We can only upload PDF, DOCX, TXT, PNG, and JPG files. We tried to upload ${invalidFilesCount} files of other types.`
        );
      }

      const newFiles = validFiles.map((file) => {
        const fileObject = {
          ...file,
          processing: true,
          id: `${file.name}-${Math.random()}`, // Unique ID for key
        };

        if (file.type.startsWith("image/")) {
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
      }, 2000);
    },
    [files]
  );

  const removeFile = (fileToRemoveId) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === fileToRemoveId);
      if (file && file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return prev.filter((file) => file.id !== fileToRemoveId);
    });
  };

  const handleFilePreview = (file) => {
    console.log(file.type, "file.type");
    if (file.type.startsWith("image/")) {
      setPreviewContent(
        <img
          src={file.previewUrl}
          alt="File preview"
          className="max-w-full h-auto"
        />
      );
      setIsPreviewModalOpen(true);
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewContent(
          <pre className="whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
            {e.target.result}
          </pre>
        );
        setIsPreviewModalOpen(true);
      };
      reader.readAsText(file);
    }
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewContent(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl my-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Document Upload System
      </h1>

      <DropzoneArea onDrop={onDrop} maxFiles={MAX_FILES_LIMIT} />
      <ErrorMessage message={error} onClose={() => setError("")} />
      <section className="mt-8" aria-labelledby="uploaded-files-title">
        <h2
          id="uploaded-files-title"
          className="text-2xl font-semibold text-gray-800 mb-4"
        >
          Uploaded Files
        </h2>
        <FileList
          files={files}
          onRemoveFile={removeFile}
          onPreviewFile={handleFilePreview}
        />
      </section>

      <PreviewModal
        isOpen={isPreviewModalOpen}
        content={previewContent}
        onClose={closePreviewModal}
      />
    </div>
  );
}
