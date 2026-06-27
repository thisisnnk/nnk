'use client';
import { type JSX, useEffect, useMemo, useRef, useState } from 'react';
import { motion, MotionProps } from 'framer-motion';

type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'p',
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  // Memoize so a re-render (e.g. parent updating `trigger`) doesn't create a
  // fresh motion component type and remount it — which would reset displayText
  // and kill the in-flight scramble.
  const MotionComponent = useMemo(
    () => motion.create(Component as keyof JSX.IntrinsicElements),
    [Component]
  );
  const [displayText, setDisplayText] = useState(children);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const text = children;

  const scramble = () => {
    // Restart cleanly if a previous run is still going (e.g. fast scroll
    // re-activating this block before the last scramble settled).
    if (intervalRef.current) clearInterval(intervalRef.current);

    const steps = duration / speed;
    let step = 0;

    intervalRef.current = setInterval(() => {
      let scrambled = '';
      const progress = step / steps;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
          continue;
        }

        if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayText(text);
        onScrambleComplete?.();
      }
    }, speed * 1000);
  };

  // Re-scramble each time `trigger` flips truthy (e.g. this case study
  // becomes the active one again on scroll). Cleans up on unmount.
  useEffect(() => {
    if (!trigger) return;
    scramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, children]);

  return (
    <MotionComponent className={className} {...props}>
      {displayText}
    </MotionComponent>
  );
}
