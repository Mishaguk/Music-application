import { useEffect, useState } from "react";
import { useInput } from "./useInput";
import { getAudioDuration, uploadToCloudinary } from "@/utils";
import { routes } from "@/constants";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export const useCreateTrackForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const title = useInput("");
  const author = useInput("");
  const text = useInput("");
  const router = useRouter();

  const uploadTrack = async () => {
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
  };

  const next = async () => {
    if (loading) return;

    if (activeStep !== 2) {
      setActiveStep((prev) => prev + 1);
    } else {
      uploadTrack();
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

  return {
    activeStep,
    setActiveStep,
    picture,
    setPicture,
    audio,
    setAudio,
    loading,
    setLoading,
    title,
    author,
    text,
    uploadTrack,
    next,
    back,
  };
};
