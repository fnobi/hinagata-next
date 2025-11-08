import { useCallback, useEffect, useRef } from "react";
import { WebGLRenderer } from "three";
import type AbstractThreeController from "~/common/lib/AbstractThreeController";

const useThreeRenderer = <T extends AbstractThreeController>() => {
  const controllerRef = useRef<T | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { current: container } = containerRef;
    if (!container) {
      return () => {};
    }

    const renderer = new WebGLRenderer({
      antialias: true
    });

    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    return () => {
      rendererRef.current = null;
      container.removeChild(renderer.domElement);
    };
  }, []);

  const handleUpdate = useCallback((t: number) => {
    const { current: controller } = controllerRef;
    const { current: renderer } = rendererRef;
    if (controller && renderer) {
      controller.update(t);
      controller.renderWith(renderer);
    }
  }, []);

  const handleResize = useCallback(() => {
    const { current: container } = containerRef;
    if (!container) {
      return;
    }
    const { offsetWidth: w, offsetHeight: h } = container;
    const { current: renderer } = rendererRef;
    if (renderer) {
      renderer.setSize(w, h);
    }
    const { current: controller } = controllerRef;
    if (controller) {
      controller.setSize(w, h);
    }
  }, []);

  useEffect(() => {
    const { current: renderer } = rendererRef;
    if (!renderer) {
      return () => {};
    }
    renderer.setAnimationLoop(handleUpdate);
    return () => renderer.setAnimationLoop(null);
  }, [handleUpdate]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return { controllerRef, containerRef };
};

export default useThreeRenderer;
