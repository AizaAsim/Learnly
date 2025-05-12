import { useEffect, useRef, useState } from "react";

interface SvgIconProps {
  src: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  opacity?: string;
  className?: string;
  width?: string;
  height?: string;
}

const SvgIcon = ({
  src,
  fill = "none",
  stroke = "darkblue",
  strokeWidth = "2.2",
  opacity = "1",
  className,
  width,
  height,
}: SvgIconProps) => {
  const [svgData, setSvgData] = useState<string | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(src)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const svg = parser
          .parseFromString(data, "image/svg+xml")
          .querySelector("svg");
        if (svg) {
          svg.setAttribute("fill", fill);
          svg.setAttribute("opacity", opacity);
          if (width) svg.setAttribute("width", width);
          if (height) svg.setAttribute("height", height);
          svg.querySelectorAll("path").forEach((path) => {
            path.setAttribute("stroke", stroke);
            path.setAttribute("stroke-width", strokeWidth);
            if (path.classList.contains("white-fill")) {
              path.setAttribute("fill", "white");
            }
          });
          setSvgData(svg.outerHTML);
        }
      });
  }, [src, fill, stroke, strokeWidth, opacity, width, height]);

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.innerHTML = svgData || "";
    }
  }, [svgData]);

  return (
    <div
      className={`flex justify-center items-center ${className}`}
      ref={iconRef}
    />
  );
};

export default SvgIcon;
