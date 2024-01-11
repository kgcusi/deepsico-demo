import { ARFaceMesh, ARView } from "react-three-mind";
import * as THREE from 'three';

function FaceFilter2D() {
  const texture = new THREE.TextureLoader().load("./images/face_mask.png");

  return (
    <ARView
      filterMinCF={1}
      filterBeta={10000}
      missTolerance={0}
      warmupTolerance={0}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <ARFaceMesh>
        <meshBasicMaterial map={texture} transparent={true} needsUpdate={true} />
      </ARFaceMesh>
    </ARView>
  );
}

export default FaceFilter2D;
