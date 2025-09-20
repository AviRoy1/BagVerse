// WebGiViewer.js
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ThreeViewer } from 'threepipe';

const FALLBACK_MODEL = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';

const WebGiViewer = forwardRef(({ modelPath, className, style }, ref) => {
  const canvasRef = useRef(null);
  const viewerRef = useRef(null);
  const initialCameraPosRef = useRef(null);
  const initialTargetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      const viewer = viewerRef.current;
      if (!viewer) return;
      const cam = viewer.scene?.activeCamera || viewer.scene?.mainCamera;
      if (cam && initialCameraPosRef.current) {
        cam.position.copy(initialCameraPosRef.current);
        cam.lookAt(0, 0, 0);
      }
      // If there are camera controls available, try to reset them too
      try {
        const ctrl = viewer.cameraControls || viewer.scene?.activeCameraCtrl || viewer.scene?.cameraCtrl;
        if (ctrl?.reset) ctrl.reset();
      } catch (_) {}
      try {
        if (viewer.render) viewer.render();
      } catch (_) {}
    },
    dispose: () => {
      if (viewerRef.current?.dispose) viewerRef.current.dispose();
      viewerRef.current = null;
    }
  }), []);

  useEffect(() => {
    let isMounted = true;
    const setupViewer = async (path) => {
      const viewer = new ThreeViewer({ canvas: canvasRef.current });
      viewerRef.current = viewer;
      try {
        await viewer.assetManager.addFromPath(path);
      } catch (err) {
        // Fallback if requested model fails to load
        try {
          await viewer.assetManager.addFromPath(FALLBACK_MODEL);
        } catch (_) {}
      }
      // Capture initial camera state
      const cam = viewer.scene?.activeCamera || viewer.scene?.mainCamera;
      if (cam) {
        initialCameraPosRef.current = cam.position.clone();
      }
    };

    if (modelPath && isMounted) {
      setupViewer(modelPath);
    }

    return () => {
      isMounted = false;
      if (viewerRef.current?.dispose) {
        viewerRef.current.dispose();
      }
      viewerRef.current = null;
    };
  }, [modelPath]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...(style || {}) }}
    />
  );
});

export default WebGiViewer;