import { Slider as MuiSlider, SliderProps } from "@mui/material";

type Props = {
  value: number;
  min: number;
  max: number;
  step?: number;
  thumbVisible?: boolean;
  maxWidth?: boolean;
} & SliderProps;

const thumbStyles = {
  "& .MuiSlider-thumb": {
    width: 8,
    height: 8,
    transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
    "&::before": {
      boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0)",
    },
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0px 0px 0px 8px ${"rgb(0 0 0 / 16%)"}`,
    },
    "&.Mui-active": {
      width: 20,
      height: 20,
    },
  },
};

const noThumbStyles = {
  "& .MuiSlider-thumb": {
    display: "none",
  },
};

const Slider = ({
  value,
  min,
  step,
  max,
  thumbVisible = true,
  maxWidth = false,
  ...props
}: Props) => {
  return (
    <MuiSlider
      value={value}
      min={min}
      step={step}
      max={max}
      sx={(t) => ({
        color: t.palette.primary.main,
        height: 4,
        width: maxWidth ? "100%" : 200,
        ...(thumbVisible ? thumbStyles : noThumbStyles),
        "& .MuiSlider-rail": {
          opacity: 0.28,
        },
      })}
      {...props}
    />
  );
};

export default Slider;
