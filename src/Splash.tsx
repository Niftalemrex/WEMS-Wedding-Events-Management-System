import React, { useEffect, useState } from "react";
import "./Splash.css";
import { useNavigate } from "react-router-dom";

// Import local image
import weddingKiss from "./assets/wedding-kiss.jpg";

interface Emoji {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
}

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [rainingEmojis, setRainingEmojis] = useState<Emoji[]>([]);

  useEffect(() => {
    // Create raining emojis
    const emojis: Emoji[] = [];
    const emojiOptions = ["💖", "✨", "🌸"];

    for (let i = 0; i < 30; i++) {
      emojis.push({
        id: i,
        emoji: emojiOptions[i % 3],
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      });
    }

    setRainingEmojis(emojis);
  }, []);

  return (
    <div className="splash">
      {/* Hero Image */}
      <div className="hero">
        <img
          src={weddingKiss} // local image used here
          alt="Bride and groom kiss"
          className="hero-image"
        />
        <div className="hero-overlay" />
      </div>

      {/* Raining Emojis */}
      <div className="rain-container">
        {rainingEmojis.map((emoji) => (
          <div
            key={emoji.id}
            className="rain-emoji"
            style={{
              left: `${emoji.left}%`,
              animationDelay: `${emoji.delay}s`,
              animationDuration: `${emoji.duration}s`,
            }}
          >
            {emoji.emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="content">
        {/* Header */}
        <div className="header">
          <span className="eyebrow">ESTABLISHED 2025</span>

          <h1 className="title">
            <span className="title-line">PRESTIGE</span>
            <span className="title-line accent">COLLECTION</span>
          </h1>

          {/* Floral Divider with optional emoji pattern */}
          <div className="floral-divider">
            <div className="emoji-pattern">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="emoji-item"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {i % 3 === 0 ? "💖" : i % 3 === 1 ? "✨" : "🌸"}
                </span>
              ))}
            </div>
            <svg
              className="floral-icon"
              viewBox="0 0 100 20"
              width="120"
              height="24"
            >
              <path
                d="M20,10 Q30,0 40,10 T60,10 T80,10"
                stroke="#d4af37"
                fill="none"
                strokeWidth="1.5"
              />
              <circle cx="30" cy="8" r="1.5" fill="#d4af37" />
              <circle cx="50" cy="12" r="1.5" fill="#d4af37" />
              <circle cx="70" cy="8" r="1.5" fill="#d4af37" />
            </svg>
          </div>

          {/* Subtitle with character animation and floating emojis */}
          <div className="subtitle-container">
            <p className="subtitle">
              {"CELEBRATING LIFE'S EXTRAORDINARY MOMENTS".split("").map(
                (char, index) => (
                  <span
                    key={index}
                    className="subtitle-char"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                )
              )}
            </p>
            <div className="subtitle-rain">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="subtitle-rain-emoji"
                  style={{
                    left: `${20 + i * 15}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  {i % 3 === 0 ? "💖" : i % 3 === 1 ? "✨" : "🌸"}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <button
            className="button-secondary"
            onClick={() => navigate("/Home")}
          >
            Let's Get Started
          </button>

          {/* Status */}
          <div className="status">
            <span className="status-dot" />
            <span className="status-text">System Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;