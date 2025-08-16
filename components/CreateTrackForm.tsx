"use client";

import StepWrapper from "./StepWrapper";
import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import DropFileInput from "./DropFileInput";
import { motion } from "motion/react";
import { useCreateTrackForm } from "@/hooks/useCreateTrackForm";

const CreateTrackForm = () => {
  const {
    activeStep,
    picture,
    setPicture,
    audio,
    setAudio,
    loading,
    title,
    author,
    text,
    back,
    next,
  } = useCreateTrackForm();

  const getAvailiableStep = (): boolean => {
    if (loading) return false;

    if (activeStep === 0 && title.value && author.value) {
      return true;
    } else if (activeStep === 1) {
      return picture !== null;
    } else {
      return audio !== null;
    }
  };

  return (
    <StepWrapper
      activeStep={activeStep}
      onBack={back}
      onNext={next}
      nextStepAvaliable={getAvailiableStep()}
    >
      {loading ? (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        <>
          {activeStep == 0 && (
            <Grid container gap={2}>
              <TextField {...title} fullWidth label="Enter track title" />
              <TextField {...author} fullWidth label="Enter author name" />
              <TextField
                {...text}
                fullWidth
                label="Enter a track text"
                multiline
                rows={3}
              />
            </Grid>
          )}
          {activeStep == 1 && (
            <Stack alignItems="center">
              {!picture ? (
                <DropFileInput
                  onChange={(file) => setPicture(file)}
                  accept={{ "image/png": [".png", ".jpg"] }}
                  label="Drag 'n' drop track picture here, or click to select files"
                />
              ) : (
                <Stack alignItems="center" gap={1}>
                  <motion.img
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={URL.createObjectURL(picture)}
                    width={200}
                    height={200}
                    alt="preview"
                    style={{
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ fontSize: "0.9rem", color: "#555" }}>
                    {picture.name}
                  </div>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => setPicture(null)}
                  >
                    Remove
                  </Button>
                </Stack>
              )}
            </Stack>
          )}
          {activeStep == 2 && (
            <Stack alignItems="center">
              {!audio ? (
                <DropFileInput
                  onChange={(file) => setAudio(file)}
                  accept={{ "audio/*": [] }}
                  label="Drag 'n' drop audio here, or click to select files"
                />
              ) : (
                <Stack alignItems="center" gap={1}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <audio controls src={URL.createObjectURL(audio)} />
                  </motion.div>
                  <div style={{ fontSize: "0.9rem", color: "#555" }}>
                    {audio.name}
                  </div>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => setAudio(null)}
                  >
                    Remove
                  </Button>
                </Stack>
              )}
            </Stack>
          )}
        </>
      )}
    </StepWrapper>
  );
};

export default CreateTrackForm;
