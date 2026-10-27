"use client";

import React, { useSyncExternalStore } from "react";

/** True when the browser can actually create a WebGL context (GPU/driver/privacy settings allow it). */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext(); // release the probe context immediately
    return true;
  } catch {
    return false;
  }
}

class WebGLErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[3D] disabled after a WebGL error:", error instanceof Error ? error.message : error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Capability never changes during a session: probe once (client only) and reuse the answer.
let webglProbe: boolean | undefined;
const probeWebGL = () => (webglProbe ??= hasWebGL());
const subscribeNever = () => () => {};

/**
 * Mounts WebGL content only when a context can be created, and contains any runtime WebGL
 * failure. Without this, three.js throwing "Error creating WebGL context" took down the whole
 * page (Next.js global error screen) for visitors with 3D enabled but no usable GPU.
 */
export function SafeWebGL({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const supported = useSyncExternalStore(subscribeNever, probeWebGL, () => null);

  if (!supported) return <>{fallback}</>;
  return <WebGLErrorBoundary fallback={fallback}>{children}</WebGLErrorBoundary>;
}
