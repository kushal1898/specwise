"use client";

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import WebGLFluid from "webgl-fluid";

export function WebGLFluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const location = useLocation();
  const fluidRef = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current) {
      fluidRef.current = WebGLFluid(canvasRef.current, {
        TRIGGER: "hover",
        IMMEDIATE: true,
        NUM_SPLASHES: 6, // Slightly more for the initial load
        DENSITY_DISSIPATION: 1.5,
        VELOCITY_DISSIPATION: 1.0,
        PRESSURE: 0.1,
        PRESSURE_ITERATIONS: 20,
        CURL: 3,
        SPLAT_RADIUS: 0.25,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 5, g: 5, b: 5 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.8,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: true,
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 1.0,
      });
    }

    return () => {
      // No standard destroy method in many versions, but we'll try if it exists
      if (fluidRef.current && typeof fluidRef.current.destroy === "function") {
        fluidRef.current.destroy();
      }
    };
  }, []);

  // Trigger splashes on navigation
  useEffect(() => {
    if (fluidRef.current && typeof fluidRef.current.splats === "function") {
      fluidRef.current.splats();
    }
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 z-[-10] w-full h-full bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full outline-none block"
      />
    </div>
  );
}

