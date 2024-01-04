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
      if (myModel.current) {
        myModel.current.rotation.x = rotation.x;
        myModel.current.rotation.y = rotation.y;
      }
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      mindarThree.stop();
    };
  }, [rotation]);

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    setStartDrag({ x: clientX, y: clientY });
  };

  const handleMove = (clientX, clientY) => {
    if (isDragging) {
      const deltaX = clientX - startDrag.x;
      const deltaY = clientY - startDrag.y;
      setRotation((rot) => ({
        x: rot.x + deltaY * 0.01,
        y: rot.y + deltaX * 0.01,
      }));
      setStartDrag({ x: clientX, y: clientY });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      ref={containerRef}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    ></div>
  );
};
