// components/RangeSlider.tsx
import React from "react";
import ReactSlider, { ReactSliderProps } from "react-slider";
const RangeSlider = <T extends number | readonly number[]>(_props: ReactSliderProps<T>) => {
  return <ReactSlider {..._props} className="w-full h-full" />;
};
export default RangeSlider;
