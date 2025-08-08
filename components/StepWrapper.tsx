import {
  Button,
  Card,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { memo, ReactNode, useEffect, useRef } from "react";

type Props = {
  activeStep: number;
  onBack: () => void;
  onNext: () => void;
  nextStepAvaliable?: boolean;
  children: ReactNode;
};

const steps = ["Track information", "Upload an image", "Upload a track"];

const StepWrapper = ({
  activeStep,
  onBack,
  onNext,
  nextStepAvaliable = true,
  children,
}: Props) => {
  const prevStepRef = useRef<number>(activeStep);

  const prevStep = prevStepRef.current;

  useEffect(() => {
    prevStepRef.current = activeStep;
  }, [activeStep]);

  const isForward = activeStep > prevStep;

  return (
    <Stack overflow="hidden" sx={{ gap: { xs: 6, xl: 10 } }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index} completed={activeStep > index}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stack alignItems="center">
        <Stack width={400}>
          <Typography color="textSecondary">
            ⚠️ Important Notice: By uploading a track, you confirm that you
            either own the rights to the content or have obtained proper
            permission from the copyright holder.
          </Typography>
        </Stack>
      </Stack>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ x: isForward ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card sx={{ width: 600, padding: 4 }}>{children}</Card>
        </motion.div>
      </AnimatePresence>
      <Stack flexDirection="row" justifyContent="space-around">
        <Button disabled={activeStep === 0} onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!nextStepAvaliable}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
};

export default memo(StepWrapper);
