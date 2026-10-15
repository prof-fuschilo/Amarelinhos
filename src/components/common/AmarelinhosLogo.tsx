import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const AmarelinhosLogo: React.FC<LogoProps> = ({
  className = '',
  size = 48,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md hover:scale-105 transition-transform"
      >
        {/* Yellow Circle Background */}
        <circle cx="100" cy="100" r="96" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
        <circle cx="100" cy="100" r="92" fill="#FACC15" />

        {/* Geometric ribbon chevron segments (Magenta, White, Black, Grey) */}
        {/* Segment 1: Magenta / Pink */}
        <path
          d="M 98 75 L 114 91 L 122 83 L 106 67 Z"
          fill="#E11D48"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Segment 2: White */}
        <path
          d="M 114 91 L 132 73 L 140 81 L 122 99 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Segment 3: Black */}
        <path
          d="M 132 73 L 148 89 L 156 81 L 140 65 Z"
          fill="#18181B"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Segment 4: Grey */}
        <path
          d="M 148 89 L 166 71 L 174 79 L 156 97 Z"
          fill="#9CA3AF"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* "AMA" - Bold Black */}
        <text
          x="12"
          y="102"
          fill="#000000"
          fontFamily="Impact, 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="46"
          letterSpacing="-1px"
        >
          AMA
        </text>

        {/* "RELINHOS" - White filled with strong black outline */}
        <text
          x="10"
          y="138"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="4"
          strokeLinejoin="round"
          fontFamily="'Arial Black', Impact, sans-serif"
          fontWeight="900"
          fontSize="35"
          letterSpacing="-0.5px"
          paintOrder="stroke fill"
        >
          RELINHOS
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-2xl font-bold tracking-wider text-yellow-400 uppercase">
            Amarelinhos
          </span>
          <span className="text-[10px] font-semibold text-neutral-400 tracking-widest uppercase">
            Grupo de Ciclismo
          </span>
        </div>
      )}
    </div>
  );
};
