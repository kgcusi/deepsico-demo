import React, { useEffect, useRef, useState } from "react";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { mockWithImage } from "./libs/camera-mock";

export default ({ image, target }) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  // Ref to store the model
  const myModelRef = useRef(null);

  // AR Setup
  useEffect(() => {
    const restoreOriginal = mockWithImage(image);
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
      myModelRef.current = gltf.scene;
      anchor.group.add(myModelRef.current);
      myModelRef.current.scale.set(10, 10, 10);
      myModelRef.current.position.set(0, -0.3, 0);
    });

    mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      mindarThree.stop();
      restoreOriginal();
    };
  }, []);

  // Rotation handling
  useEffect(() => {
    if (myModelRef.current) {
      myModelRef.current.rotation.x = rotation.x;
      myModelRef.current.rotation.y = rotation.y;
    }
  }, [rotation]); // Depend on rotation state


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
      // onMouseLeave={handleMouseUp} // In case mouse leaves the container
    ></div>
  );
};
