// components/CircularProgressBar.tsx
import { motion } from "framer-motion";

interface CircularProgressBarProps {
  value: number;
  label: string;
  sign?: string;
  primaryColor?: string; // Tailwind color class (e.g., "bg-primary", "bg-red-500")
  secondaryColor?: string; // Tailwind color class for background
  size?: number;
  strokeWidth?: number;
  textSize?: string; // Tailwind text size class
}

const CircularProgressBar = ({
  value,
  label,
  sign,
  primaryColor = "bg-primary", // Default to 'primary' from your Tailwind config
  secondaryColor = "bg-secondary", // Default to 'secondary' from your Tailwind config
  size = 200,
  strokeWidth = 14,
  textSize = "text-4xl",
}: CircularProgressBarProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center     max-lg:scale-75">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle
            className={`${secondaryColor} text-opacity-20`}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Animated progress circle */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox={`0 0 ${size} ${size}`}
        >
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={primaryColor}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* Center circle with white background */}
        <div
          className="absolute rounded-full  flex items-center justify-center "
          style={{
            width: size * 0.6,
            height: size * 0.6,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <span className={`${textSize} font-bold text-primary block`}>
              {value}
              {sign && <span className="ml-1">{sign}</span>}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-tertiary py-2 flex text-sm text-center font-semibold"
      >
        {label}
      </motion.p>
    </div>
  );
};

export default CircularProgressBar;
