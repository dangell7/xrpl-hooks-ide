import React from "react";
import { styled, keyframes } from "../stitches.config";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const StyledContent = styled(TooltipPrimitive.Content, {
  borderRadius: 4,
  padding: "$2 $3",
  fontSize: 12,
  lineHeight: 1,
  color: "$text",
  backgroundColor: "$background",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  "@media (prefers-reduced-motion: no-preference)": {
    animationDuration: "400ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    animationFillMode: "forwards",
    willChange: "transform, opacity",
    '&[data-state="delayed-open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
  ".dark &": {
    boxShadow:
      "0px 0px 10px 2px rgba(255,255,255,.15), hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  },
  ".light &": {
    boxShadow:
      "0px 0px 10px 2px rgba(0,0,0,.15), hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  },
});

const StyledArrow = styled(TooltipPrimitive.Arrow, {
  fill: "$background",
});

interface ITooltip {
  content: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Tooltip: React.FC<ITooltip & { children: React.ReactNode }> = ({
  children,
  content,
  open,
  defaultOpen = false,
  onOpenChange,
}) => {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <StyledContent side="bottom" align="center">
        {content}
        <StyledArrow offset={5} width={11} height={5} />
      </StyledContent>
    </TooltipPrimitive.Root>
  );
};

export default Tooltip;
