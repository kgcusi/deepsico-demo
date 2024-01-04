import React, { useEffect, useRef, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default ({ target }) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  let myModel = useRef(null);

  // AR Setup and Model Loading
  useEffect(() => {
    const mindarThree = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: target,
    });

    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const anchor = mindarThree.addAnchor(0);
    const loader = new GLTFLoader();
    loader.load("./models/01_barren.glb", (gltf) => {
      myModel.current = gltf.scene;
      anchor.group.add(myModel.current);
      myModel.current.scale.set(10, 10, 10);
      myModel.current.position.set(0, -0.3, 0);
    });

    mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      mindarThree.stop();
    };
  }, [target]); // Only run this effect on mount and when 'target' changes

  // Rotation Handling
  useEffect(() => {
    if (myModel.current) {
      myModel.current.rotation.x = rotation.x;
      myModel.current.rotation.y = rotation.y;
    }
  }, [rotation]); // Run this effect when 'rotation' changes

  // Event Handlers for Rotation
  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartDrag({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const deltaX = event.clientX - startDrag.x;
      const deltaY = event.clientY - startDrag.y;
      setRotation((rot) => ({
        x: rot.x + deltaY * 0.01,
        y: rot.y + deltaX * 0.01,
      }));
      setStartDrag({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    ></div>
  );
};
