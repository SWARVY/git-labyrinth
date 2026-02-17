import bonfireImg from "@shared/assets/bonfire.png";

/**
 * Sparkle positions from OG image (offsets from bonfire center).
 * OG bonfire size = 80px; positions are scaled proportionally.
 */
const OG_BONFIRE_SIZE = 80;

const SPARK_BASE_POSITIONS = [
  { x: -8, y: -20, delay: "0.0s" },
  { x: 12, y: -28, delay: "0.3s" },
  { x: -15, y: -35, delay: "0.6s" },
  { x: 5, y: -42, delay: "0.9s" },
  { x: -3, y: -15, delay: "1.2s" },
  { x: 18, y: -22, delay: "0.5s" },
];

interface CampfireCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export function CampfireCanvas({
  width = 160,
  height = 160,
  className,
}: CampfireCanvasProps) {
  const scale = width / OG_BONFIRE_SIZE;

  return (
    <div className={`relative ${className ?? ""}`} style={{ width, height }}>
      {/* Bonfire image */}
      <img
        src={bonfireImg}
        alt="Bonfire"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Fire sparkles — CSS animated, matching OG image */}
      {SPARK_BASE_POSITIONS.map((sp, i) => (
        <span
          key={i}
          className="pointer-events-none absolute animate-[spark_1.8s_ease-in-out_infinite] bg-[#fbbf24]"
          style={{
            width: 2,
            height: 2,
            left: `calc(50% + ${sp.x * scale}px)`,
            top: `calc(50% + ${sp.y * scale}px)`,
            animationDelay: sp.delay,
          }}
        />
      ))}
    </div>
  );
}
