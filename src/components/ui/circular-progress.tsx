interface CircularProgressProps {
  strokeWidth?: number;
  width?: number;
  percentage: number;
  showPercentage?: boolean;
}

const CircularProgress = ({
  strokeWidth = 6,
  width = 105,
  percentage,
  showPercentage = false,
}: CircularProgressProps) => {
  const radius = (width - strokeWidth) / 2;
  const viewBox = `0 0 ${width} ${width}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * (percentage || 0)) / 100;

  return (
    <div className="relative" style={{ width }}>
      <svg width={width} height={width} viewBox={viewBox}>
        <circle
          className="fill-none stroke-grayscale-16"
          cx={width / 2}
          cy={width / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          className="fill-none stroke-black transition-all ease-in delay-200"
          cx={width / 2}
          cy={width / 2}
          r={radius}
          strokeLinecap="round"
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${width / 2} ${width / 2})`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
      {showPercentage && (
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm md:text-3xl font-semibold">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
};

export default CircularProgress;
