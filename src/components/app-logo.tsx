import { cn } from "@/utils/ui"
import * as React from "react";

export function AppLogo(props: React.ButtonHTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={"0 0 100 100"}
      className={cn("stroke-secondary", props.className)}
    >
      <g className="-rotate-6 scale-[0.85] origin-center">
        {[10, 30, 50, 70, 90].flatMap((n) => [
          <line
            x1={n}
            y1={0}
            x2={n}
            y2={100}
            strokeWidth={5}
            strokeLinecap="round"
            key={"a" + n}
          />,
          <line
            y1={n}
            x1={0}
            y2={n}
            x2={100}
            strokeWidth={5}
            strokeLinecap="round"
            key={"b" + n}
          />,
        ])}
      </g>
    </svg>
  );
}
