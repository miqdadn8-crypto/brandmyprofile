// Region flags as inline SVG: emoji flags render as two-letter codes on Windows.
export default function RegionFlag({ code, name, size = "sm" }: { code: string; name: string; size?: "lg" | "md" | "sm" }) {
  const commonProps = {
    className: `${size === "lg" ? "h-16 w-24 rounded-md" : size === "md" ? "h-4 w-6 rounded-[3px]" : "h-11 w-16 rounded-md"} shrink-0 overflow-hidden shadow-sm ring-1 ring-border/60`,
    viewBox: "0 0 64 48",
    role: "img",
    "aria-label": `${name} flag`,
  };

  if (code === "uae") {
    return (
      <svg {...commonProps}>
        <rect width="64" height="48" fill="#fff" />
        <rect x="0" y="0" width="18" height="48" fill="#ef3340" />
        <rect x="18" y="0" width="46" height="16" fill="#009739" />
        <rect x="18" y="32" width="46" height="16" fill="#000" />
      </svg>
    );
  }

  if (code === "saudi") {
    return (
      <svg {...commonProps}>
        <rect width="64" height="48" fill="#006c35" />
        <text
          x="32"
          y="21"
          fill="#fff"
          fontFamily="serif"
          fontSize="10"
          fontWeight="700"
          textAnchor="middle"
          direction="rtl"
        >
          لا إله إلا الله
        </text>
        <text
          x="32"
          y="31"
          fill="#fff"
          fontFamily="serif"
          fontSize="8.5"
          fontWeight="700"
          textAnchor="middle"
          direction="rtl"
        >
          محمد رسول الله
        </text>
        <path d="M18 36h26" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M42 36l5-2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (code === "qatar") {
    const points = Array.from({ length: 10 }, (_, index) => {
      const y = index * 4.8;
      return `${index % 2 === 0 ? 20 : 12},${y}`;
    }).join(" ");

    return (
      <svg {...commonProps}>
        <rect width="64" height="48" fill="#8a1538" />
        <polygon points={`0,0 20,0 ${points} 20,48 0,48`} fill="#fff" />
      </svg>
    );
  }

  if (code === "kuwait") {
    return (
      <svg {...commonProps}>
        <rect width="64" height="16" fill="#007a3d" />
        <rect y="16" width="64" height="16" fill="#fff" />
        <rect y="32" width="64" height="16" fill="#ce1126" />
        <polygon points="0,0 22,16 22,32 0,48" fill="#000" />
      </svg>
    );
  }

  if (code === "bahrain") {
    const teeth = Array.from({ length: 5 }, (_, index) => {
      const y = index * 9.6;
      return `${20},${y} 26,${y + 4.8}`;
    }).join(" ");
    return (
      <svg {...commonProps}>
        <rect width="64" height="48" fill="#ce1126" />
        <polygon points={`0,0 20,0 ${teeth} 20,48 0,48`} fill="#fff" />
      </svg>
    );
  }

  if (code === "oman") {
    return (
      <svg {...commonProps}>
        <rect width="64" height="16" fill="#fff" />
        <rect y="16" width="64" height="16" fill="#db161b" />
        <rect y="32" width="64" height="16" fill="#008000" />
        <rect width="16" height="48" fill="#db161b" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <rect width="64" height="16" fill="#ff9933" />
      <rect y="16" width="64" height="16" fill="#fff" />
      <rect y="32" width="64" height="16" fill="#138808" />
      <circle cx="32" cy="24" r="5.5" fill="none" stroke="#000080" strokeWidth="1.5" />
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index * 30 * Math.PI) / 180;
        return (
          <line
            key={index}
            x1="32"
            y1="24"
            x2={32 + Math.cos(angle) * 5.5}
            y2={24 + Math.sin(angle) * 5.5}
            stroke="#000080"
            strokeWidth="0.55"
          />
        );
      })}
    </svg>
  );
}
