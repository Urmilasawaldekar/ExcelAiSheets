import React from "react";
import { ToastProvider } from "../components/FileUpload";
import FileUpload from "../components/FileUpload";

const UploadPage = () => {
  return (
    <ToastProvider>
      <FileUpload />
    </ToastProvider>
  );
};

export default UploadPage;
