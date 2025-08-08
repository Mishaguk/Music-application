import { UploadRounded } from "@mui/icons-material";
import { motion } from "motion/react";
import { Accept, useDropzone } from "react-dropzone";

type DropFileInputProps = {
  onChange: (file: File) => void;
  accept: Accept;
  label?: string;
};

const DropFileInput = ({ onChange, accept, label }: DropFileInputProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (files.length > 0) onChange(files[0]);
    },
    accept,
    maxFiles: 1,
  });

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed gray",
          width: "300px",
          height: "300px",
          padding: "30px",
          borderRadius: "8px",
          display: "flex",

          gap: "8px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: isDragActive ? "#67656549" : "#fff",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <UploadRounded fontSize="large" />
        {label ?? `Drag 'n' drop some files here, or click to select files `}
      </div>
    </motion.div>
  );
};

export default DropFileInput;
