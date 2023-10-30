import classNames from 'classnames';
import { pickRandomFromRange } from '../../../utils/utils';
import React, { useEffect } from 'react';

const INITIAL_WAIT_TIME = 1000;
const CLEAR_TIME = 100;
const MAX_GLITCH_COUNT = 1;
const MAX_GLITCH_SEQUENCE_COUNT = 3;
const MAX_GLITCH_FREQUENCY_MS = 2000;
const MAX_GLITCH_WIDTH = 5;
const OFFSET_GLITCH_WIDTH = 5;
const MAX_GLITCH_LEFT = 20;

export interface ImageGlitchProps {
  src: string;
}

const ImageGlitch = ({ src }: ImageGlitchProps) => {
  const [srcImage, setSrcImage] = React.useState(src);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [glitchCount, setGlitchCount] = React.useState(1);
  const [glitchSequenceCount, setGlitchSequenceCount] = React.useState(1);
  const [glitchWidth, setGlitchWidth] = React.useState([] as number[]);
  const [glitchLeft, setGlitchLeft] = React.useState([] as number[]);
  const [glitchTop, setGlitchTop] = React.useState([] as number[]);

  function makeGlitch() {
    for (let i = 0; i < glitchCount; i++) {
      glitchWidth[i] = Math.random() * MAX_GLITCH_WIDTH + OFFSET_GLITCH_WIDTH;
      glitchTop[i] = pickRandomFromRange(
        i === 0 ? 0 : glitchTop[i - 1] + glitchWidth[i - 1],
        100 - (MAX_GLITCH_WIDTH + OFFSET_GLITCH_WIDTH),
      );
      glitchLeft[i] = Math.random() * (2 * MAX_GLITCH_LEFT) - MAX_GLITCH_LEFT;
    }

    return { glitchWidth, glitchTop, glitchLeft };
  }

  function clearGlitch() {
    setGlitchWidth([]);
    setGlitchTop([]);
    setGlitchLeft([]);
  }

  function toggleGlitch() {
    setIsEnabled(!isEnabled);
  }

  function startGlitch() {
    if (!isEnabled) {
      return;
    }

    const glitchWaitTime: number[] = [];
    setGlitchCount(Math.floor(Math.random() * MAX_GLITCH_COUNT) + 1);
    setGlitchSequenceCount(
      Math.floor(Math.random() * MAX_GLITCH_SEQUENCE_COUNT) + 1,
    );

    for (let i = 0; i < glitchSequenceCount; i++) {
      const delaySeed = i + 1;
      glitchWaitTime[i] = Math.random() * (100 * delaySeed) + 100;

      setTimeout(() => {
        setGllitch(makeGlitch());
      }, glitchWaitTime[i]);
    }

    const maxWaitTime = Math.max.apply(null, glitchWaitTime);
    const clearTime = maxWaitTime + CLEAR_TIME;

    setTimeout(() => {
      clearGlitch();
    }, clearTime);

    setTimeout(
      () => {
        startGlitch();
      },
      Math.random() * MAX_GLITCH_FREQUENCY_MS + clearTime,
    );
  }

  function setGllitch({
    glitchWidth,
    glitchTop,
    glitchLeft,
  }: {
    glitchWidth: number[];
    glitchTop: number[];
    glitchLeft: number[];
  }) {
    setGlitchWidth(glitchWidth);
    setGlitchTop(glitchTop);
    setGlitchLeft(glitchLeft);
  }

};
