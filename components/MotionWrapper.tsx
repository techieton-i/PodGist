"use client";

import { motion, TargetAndTransition, VariantLabels } from "motion/react";
import React from "react";

type MotionWrapperProps = React.PropsWithChildren<{
  initial?: boolean | TargetAndTransition | VariantLabels | undefined;
  animate?: boolean | TargetAndTransition | VariantLabels | undefined;
  transition?: object;
  className?: string;
  onClick?: () => void;
}>;

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  initial = { opacity: 0, y: 24 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.5, ease: "easeOut", delay: 0.7 },
  className,
  onClick,
}) => (
  <motion.div
    initial={initial}
    animate={animate}
    transition={{ ...transition, ease: "easeInOut" }}
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export default MotionWrapper;
