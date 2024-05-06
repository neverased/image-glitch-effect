import React, { useEffect, useState } from "react";
import classnames from "classnames";

function pickRandomFromRange(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
}

const INITIAL_WAIT_TIME = 1000;
const CLEAR_TIME = 100;
const MAX_GLITCH_COUNT = 1;
const MAX_GLITCH_SEQUENCE_COUNT = 3;
const MAX_GLITCH_FREQUENCY_MS = 2000;
const MAX_GLITCH_WIDTH = 5;
const OFFSET_GLITCH_WIDTH = 5;
const MAX_GLITCH_LEFT = 20;

interface GlitchImageProps {
  src: string;
}

interface GlitchData {
  glitchWidth: number[];
  glitchTop: number[];
  glitchLeft: number[];
}

const GlitchImage: React.FC<GlitchImageProps> = ({ src }) => {
  const [isEnabled, setEnabled] = useState<boolean>(false);
  const [glitchCount, setGlitchCount] = useState<number>(1);
  const [glitchSequenceCount, setGlitchSequenceCount] = useState<number>(1);
  const [glitchData, setGlitchData] = useState<GlitchData>({
    glitchWidth: [],
    glitchTop: [],
    glitchLeft: [],
  });

  useEffect(() => {
    clearGlitch();
    setEnabled(true);

    const timeoutId = setTimeout(() => {
      startGlitch();
    }, INITIAL_WAIT_TIME);

    return () => {
      setEnabled(false);
      clearTimeout(timeoutId);
    };
  }, []);

  const startGlitch = () => {
    if (!isEnabled) {
      return;
    }
    const glitchWaitTime: number[] = [];
    setGlitchCount(Math.floor(Math.random() * MAX_GLITCH_COUNT) + 1);
    setGlitchSequenceCount(
      Math.floor(Math.random() * MAX_GLITCH_SEQUENCE_COUNT) + 1
    );

    for (let i = 0; i < glitchSequenceCount; i++) {
      const delaySeed = i + 1;
      glitchWaitTime[i] = Math.random() * (100 * delaySeed) + 100;

      setTimeout(() => {
        setGlitchData(makeGlitch());
      }, glitchWaitTime[i]);
    }

    const maxWaitTime = Math.max.apply(null, glitchWaitTime);
    const clearTime = maxWaitTime + CLEAR_TIME;

    setTimeout(() => {
      clearGlitch();
    }, clearTime);

    setTimeout(() => {
      startGlitch();
    }, Math.random() * MAX_GLITCH_FREQUENCY_MS + clearTime);
  };

  const makeGlitch = () => {
    const glitchWidth: number[] = [];
    const glitchTop: number[] = [];
    const glitchLeft: number[] = [];

    for (let i = 0; i < glitchCount; i++) {
      glitchWidth[i] = Math.random() * MAX_GLITCH_WIDTH + OFFSET_GLITCH_WIDTH;
      glitchTop[i] = pickRandomFromRange(
        i === 0 ? 0 : glitchTop[i - 1] + glitchWidth[i - 1],
        100 - (MAX_GLITCH_WIDTH + OFFSET_GLITCH_WIDTH)
      );
      Math.random() * (100 - MAX_GLITCH_WIDTH + OFFSET_GLITCH_WIDTH);
      glitchLeft[i] = Math.random() * (2 * MAX_GLITCH_LEFT) - MAX_GLITCH_LEFT;
    }

    return { glitchWidth, glitchTop, glitchLeft };
  };

  const clearGlitch = () => {
    const glitchWidth = [];
    const glitchTop = [];
    const glitchLeft = [];

    for (let i = 0; i < glitchCount; i++) {
      glitchWidth[i] = 0;
      glitchTop[i] = 0;
      glitchLeft[i] = 0;
    }

    setGlitchData({ glitchWidth, glitchTop, glitchLeft });
  };

  if (glitchData.glitchWidth) {
    const baseStyle = [...Array(glitchCount + 1)].map((_, i) => {
      const clipTop =
        0 < i && i <= glitchData.glitchTop.length
          ? glitchData.glitchTop[i - 1] + glitchData.glitchWidth[i - 1]
          : 0;
      const clipBottom =
        i < glitchData.glitchTop.length ? glitchData.glitchTop[i] : 100;

      return {
        "--gi-clip-top": `${clipTop}%`,
        "--gi-clip-bottom": `${clipBottom}%`,
      };
    });

    const glitchStyle = [...Array(glitchCount)].map((_, i) => {
      const clipTop = glitchData.glitchTop[i];
      const clipBottom =
        glitchData.glitchTop[i] + glitchData.glitchWidth[i];

      return {
        "--gi-clip-top": `${clipTop}%`,
        "--gi-clip-bottom": `${clipBottom}%`,
        left: `${glitchData.glitchLeft[i]}px`,
      };
    });

    return (
      <div className="container">
        {baseStyle.map((style, i) => (
            <img
                src={src}
                className={classnames("base-image", { absolute: i !== 0 })}
                style={style as React.CSSProperties} // Explicitly type the style object
            />
        ))}
        {glitchStyle.map((style) => {
          const hueSeed = Math.random();
          return (
            <img
              src={src}
              className={classnames("base-image absolute glitch", {
                red: hueSeed < 0.2,
                blue: 0.8 < hueSeed,
              })}
              style={style}
            />
          );
        })}
      </div>
    );
  }

  return null;
};

export default GlitchImage;
