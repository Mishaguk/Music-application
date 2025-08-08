"use client";
import DropFileInput from "@/components/DropFileInput";

import StepWrapper from "@/components/StepWrapper";
import { routes } from "@/constants";
import { useInput } from "@/hooks/useInput";
import { api } from "@/lib/api";
import { getAudioDuration, uploadToCloudinary } from "@/utils";

import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
} from "@mui/material";

import { motion } from "motion/react";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

const Create = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const title = useInput("");
  const author = useInput("");
  const text = useInput("");
  const router = useRouter();

  const next = async () => {
    if (loading) return;

    if (activeStep !== 2) {
      setActiveStep((prev) => prev + 1);
    } else {
      if (!audio || !picture) return;
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("name", title.value);
        formData.append("artist", author.value);
        formData.append("text", text.value);

        const imageUrl = await uploadToCloudinary(picture, "image");
        const audioUrl = await uploadToCloudinary(audio, "audio");

        formData.append("picture", imageUrl);
        formData.append("audio", audioUrl);

        const duration = await getAudioDuration(audio);
        formData.append("duration", duration.toString());

        await api.post("/api/tracks", formData);
        router.push(routes.tracks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const back = () => {
    setActiveStep((prev) => prev - 1);
  };

  useEffect(() => {
    const objectUrl = picture && URL.createObjectURL(picture);
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [picture]);

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
    <div>
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
                    accept={{ "image/*": [] }}
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
    </div>
  );
};

export default Create;
