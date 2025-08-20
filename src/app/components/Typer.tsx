
"use client";

import { useState, useEffect } from 'react';

interface TyperProps {
  words: string[];
  delay?: number;
}

const Typer: React.FC<TyperProps> = ({ words, delay = 2000 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  // Effect for typing/deleting letters
  useEffect(() => {
    if (words.length === 0) {
      setCurrentWord('');
      return;
    }
    if (index >= words.length) { // Reset index if it goes out of bounds
        setIndex(0);
        setSubIndex(0);
        setReverse(false);
        return;
    }

    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      // Add a pause before deleting
      const pauseTimeout = setTimeout(() => {
         setSubIndex((prev) => prev -1); // Start deleting
      }, delay / 2);
      return () => clearTimeout(pauseTimeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? delay/2 : 150, 75));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, delay]);

  // Effect for word display
  useEffect(() => {
    if (words.length > 0 && index < words.length) {
      setCurrentWord(words[index].substring(0, subIndex));
    } else {
      setCurrentWord('');
    }
  }, [subIndex, index, words]);

  // Effect for blinking cursor
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  return (
    <>
      {currentWord}
      <span className={blink ? 'animate-pulse' : ''}>|</span>
    </>
  );
};

export default Typer;
