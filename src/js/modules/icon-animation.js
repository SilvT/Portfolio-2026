// src/js/modules/icon-animation.js
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

/**
 * Adds a smooth physics bounce with visible bounces using keyframes
 * The bounce starts with the rebound (continuing orbit momentum), then settles
 * @param {gsap.core.Timeline} timeline - GSAP timeline
 * @param {Element} target - Element to animate
 * @param {Object} options - Bounce configuration
 */
function addSmoothBounce(timeline, target, options = {}) {
  const {
    totalDuration = 2,
    distance = 30,        // pixels for first bounce
    reboundDirection = "up",   // direction of the REBOUND (where dot launches to)
    bounces = 4,          // number of visible bounces
    energyRetention = 0.55
  } = options;

  // Determine which property and direction for the REBOUND (up/away from impact)
  const isVertical = reboundDirection === "down" || reboundDirection === "up";
  const prop = isVertical ? "y" : "x";
  // Rebound goes in the specified direction, gravity pulls back opposite
  const reboundSign = (reboundDirection === "down" || reboundDirection === "right") ? 1 : -1;

  // Calculate bounce heights and timing based on physics
  const timeDecay = Math.sqrt(energyRetention);
  const keyframes = [];

  let currentHeight = distance;
  let totalTimeUnits = 0;
  const bounceData = [];

  // First, calculate all bounces to get total time
  for (let i = 0; i < bounces; i++) {
    const timeUnit = Math.pow(timeDecay, i);
    bounceData.push({ height: currentHeight, timeUnit });
    totalTimeUnits += timeUnit * 2; // up + down
    currentHeight *= energyRetention;
  }

  // Now create keyframes scaled to totalDuration
  const timeScale = totalDuration / totalTimeUnits;

  bounceData.forEach((bounce, i) => {
    const upTime = bounce.timeUnit * timeScale;
    const downTime = bounce.timeUnit * timeScale;

    // REBOUND UP (launches from impact, decelerating)
    keyframes.push({
      [prop]: `+=${reboundSign * bounce.height}`,
      duration: upTime,
      ease: i === 0 ? "power2.out" : "sine.out"  // First bounce continues momentum (fast start, slows)
    });

    // FALL DOWN (gravity pulls back, accelerating)
    keyframes.push({
      [prop]: `-=${reboundSign * bounce.height}`,
      duration: downTime,
      ease: "sine.in"
    });
  });

  timeline.to(target, { keyframes });
}

export function initIconAnimation() {
  const dot = document.querySelector("#dot");
  const bouncePathOne = document.querySelector("#bouncePathOne");
  const bouncePathTwo = document.querySelector("#bouncePathTwo");
  const orbitPathOne = document.querySelector("#orbitPathOne");
  const orbitPathTwo = document.querySelector("#orbitPathTwo");

  if (!dot || !bouncePathOne || !bouncePathTwo || !orbitPathOne || !orbitPathTwo) {
    console.warn("Icon animation: Missing required SVG elements");
    return;
  }

  // Respect reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const tl = gsap.timeline({ repeat: -1 });

  // 1. Dot follows orbitPathOne - starts slow, accelerates into bounce
  tl.to(dot, {
    motionPath: {
      path: orbitPathOne,
      align: orbitPathOne,
      alignOrigin: [0.5, 0.5],
      start: 1,
      end: 0
    },
    ease: "sine.in",
    duration: 2.5
  });

  // 2. Bounce launches UP (rebounds from bottom impact), 4 seconds, 4 bounces
  addSmoothBounce(tl, dot, {
    totalDuration: 4,
    distance: 30,
    reboundDirection: "up",
    bounces: 4,
    energyRetention: 0.5
  });

  // 3. Pause before orbitPathTwo
  tl.to(dot, { duration: 2.5 });

  // 4. Dot follows orbitPathTwo - starts slow, accelerates into bounce
  tl.to(dot, {
    motionPath: {
      path: orbitPathTwo,
      align: orbitPathTwo,
      alignOrigin: [0.5, 0.5],
      start: 1,
      end: 0
    },
    ease: "sine.in",
    duration: 2.5
  });

  // 4. Bounce launches DOWN (rebounds from top impact), 6 seconds, 5 bounces
  addSmoothBounce(tl, dot, {
    totalDuration: 6,
    distance: 25,
    reboundDirection: "up",
    bounces: 5,
    energyRetention: 0.5
  });

  // 5. Pause before loop restarts
  tl.to(dot, { duration: 6 });

  return tl;
}
