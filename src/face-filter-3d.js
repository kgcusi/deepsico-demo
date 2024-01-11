import React, { useState, useEffect } from 'react';
import { ARView, ARAnchor } from "react-three-mind";
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Model(props) {
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('./models/cyberpunk-mask.glb', (gltf) => {
      gltf.scene.rotation.x = Math.PI; // Rotate by 180 degrees around the X-axis
      gltf.scene.position.y = -.8; // Move the model up a bit so it fits the face better.
      gltf.scene.position.x = .1; // Move the model up a bit so it fits the face better.
      gltf.scene.position.z = -.5; // Move the model up a bit so it fits the face better.
      gltf.scene.scale.multiplyScalar(.8);
      setModel(gltf.scene);
    });
  }, []);

  return model ? <primitive object={model} {...props} /> : null;
}

function FaceFilter2D() {
  return (
    <ARView
      filterMinCF={1}
      filterBeta={10000}
      missTolerance={0}
      warmupTolerance={0}
    >
      <hemisphereLight skyColor={"0xffffff"} groundColor={"0xbbbbff"} intensity={0.5} />
      <ARAnchor target={1}>
        <Model />
      </ARAnchor>
    </ARView>
  );
}

export default FaceFilter2D;
