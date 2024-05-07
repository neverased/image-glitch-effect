import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./ImageGlitch.css";

const INITIAL_WAIT_TIME = 1000;
const CLEAR_TIME = 100;
const MAX_GLITCH_COUNT = 3;
const MAX_GLITCH_FREQUENCY_MS = 2000;
const MAX_GLITCH_WIDTH = 5;
const OFFSET_GLITCH_WIDTH = 5;
const MAX_GLITCH_LEFT = 20;

function pickRandomFromRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

interface GlitchData {
    glitchWidth: number[];
    glitchTop: number[];
    glitchLeft: number[];
}

interface GlitchImageProps {
    src: string;
}

const GlitchImage: React.FC<GlitchImageProps> = ({ src }) => {
    const [isEnabled, setEnabled] = useState<boolean>(true);
    const [glitchData, setGlitchData] = useState<GlitchData>({
        glitchWidth: [],
        glitchTop: [],
        glitchLeft: [],
    });

    useEffect(() => {
        if (!src) {
            console.error("GlitchImage: src prop is required");
            return;
        }
        const startGlitching = () => {
            startGlitch();
            const intervalId = setInterval(startGlitch, MAX_GLITCH_FREQUENCY_MS);
            return () => clearInterval(intervalId);
        };

        const timeoutId = setTimeout(startGlitching, INITIAL_WAIT_TIME);
        return () => clearTimeout(timeoutId);
    }, [src]);

    const startGlitch = () => {
        if (!isEnabled) return;

        setGlitchData(makeGlitch());
        setTimeout(clearGlitch, CLEAR_TIME);
    };

    const makeGlitch = () => {
        const glitchCount = Math.floor(Math.random() * MAX_GLITCH_COUNT) + 1;
        const glitchWidth = Array.from(
            { length: glitchCount },
            () => Math.random() * MAX_GLITCH_WIDTH + OFFSET_GLITCH_WIDTH
        );
        const glitchTop = Array.from({ length: glitchCount }, (_, i) => pickRandomFromRange(0, 100 - glitchWidth[i]));
        const glitchLeft = Array.from(
            { length: glitchCount },
            () => Math.random() * (2 * MAX_GLITCH_LEFT) - MAX_GLITCH_LEFT
        );

        return { glitchWidth, glitchTop, glitchLeft };
    };

    const clearGlitch = () => {
        setGlitchData({
            glitchWidth: [],
            glitchTop: [],
            glitchLeft: [],
        });
    };

    if (!src) {
        return null; // Don't render anything if src is not provided
    }

    return (
        <div className="container">
            <img
                src={src}
                className="base-image"
                alt="Background"
            />
            {glitchData.glitchWidth.map((width, i) => (
                <img
                    key={i}
                    src={src}
                    className={classNames("base-image", "absolute", "glitch", {
                        red: Math.random() < 0.2,
                        blue: Math.random() > 0.8,
                    })}
                    style={{
                        clip: `rect(${glitchData.glitchTop[i]}%, auto, ${glitchData.glitchTop[i] + width}%, auto)`,
                        left: `${glitchData.glitchLeft[i]}px`,
                    }}
                    alt="Glitch"
                />
            ))}
        </div>
    );
};

GlitchImage.propTypes = {
    src: PropTypes.string.isRequired,
};

export default GlitchImage;
