export function NeonHeart() {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="neon-heart"
      >
        <defs>
          {/* Glow filter for neon effect */}
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Outer glow */}
          <filter id="outer-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow layer */}
        <path
          d="M200,320 C200,320 80,220 80,160 C80,120 110,90 150,90 C170,90 190,100 200,115 C210,100 230,90 250,90 C290,90 320,120 320,160 C320,220 200,320 200,320 Z"
          fill="none"
          stroke="#ff0080"
          strokeWidth="3"
          filter="url(#outer-glow)"
          opacity="0.6"
          className="animate-pulse-slow"
        />

        {/* Main neon heart */}
        <path
          d="M200,320 C200,320 80,220 80,160 C80,120 110,90 150,90 C170,90 190,100 200,115 C210,100 230,90 250,90 C290,90 320,120 320,160 C320,220 200,320 200,320 Z"
          fill="none"
          stroke="#ff0080"
          strokeWidth="4"
          filter="url(#neon-glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="heart-path"
        />

        {/* Inner bright core */}
        <path
          d="M200,320 C200,320 80,220 80,160 C80,120 110,90 150,90 C170,90 190,100 200,115 C210,100 230,90 250,90 C290,90 320,120 320,160 C320,220 200,320 200,320 Z"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Animated sparkle points */}
        <circle cx="150" cy="100" r="3" fill="#fff" className="sparkle sparkle-1" />
        <circle cx="250" cy="100" r="3" fill="#fff" className="sparkle sparkle-2" />
        <circle cx="200" cy="280" r="3" fill="#fff" className="sparkle sparkle-3" />
        <circle cx="130" cy="180" r="2" fill="#fff" className="sparkle sparkle-4" />
        <circle cx="270" cy="180" r="2" fill="#fff" className="sparkle sparkle-5" />
      </svg>

      <style>{`
        .neon-heart {
          filter: drop-shadow(0 0 20px rgba(255, 0, 128, 0.8));
        }

        .heart-path {
          animation: neon-flicker 4s infinite alternate;
        }

        @keyframes neon-flicker {
          0%, 100% {
            stroke: #ff0080;
            filter: url(#neon-glow) drop-shadow(0 0 10px #ff0080);
          }
          50% {
            stroke: #ff3399;
            filter: url(#neon-glow) drop-shadow(0 0 20px #ff0080);
          }
        }

        .animate-pulse-slow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-1 { animation-delay: 0s; }
        .sparkle-2 { animation-delay: 0.4s; }
        .sparkle-3 { animation-delay: 0.8s; }
        .sparkle-4 { animation-delay: 1.2s; }
        .sparkle-5 { animation-delay: 1.6s; }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}
