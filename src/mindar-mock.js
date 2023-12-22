import React, { useEffect, useRef } from "react"
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import artbat2Mind from "./targets/artbat_logo.mind"
import lotusFlowerMind from "./targets/lotus-flower.mind"
import { mockWithImage } from "./libs/camera-mock"

export default ({ image, target }) => {
  const containerRef = useRef(null)

  let myModel = null

  useEffect(() => {
    // Call the mockWithImage function
    const restoreOriginal = mockWithImage(image)

    // After setting up the mock, initialize MindARThree
    const mindarThree = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: target,
    })

    const { renderer, scene, camera } = mindarThree

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    scene.add(light)

    const anchor = mindarThree.addAnchor(0)
    // Load 3D Model
    const loader = new GLTFLoader()
    loader.load("/models/01_barren.glb", (gltf) => {
      myModel = gltf.scene
      anchor.group.add(myModel)

      // Initial positioning and scaling, if needed
      myModel.scale.set(10, 10, 10) // Scale down
      myModel.position.set(0, -0.3, 0) // Set position
    })

    mindarThree.start()
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })

    return () => {
      // Clean up: stop animation, stop MindARThree, and restore original getUserMedia
      renderer.setAnimationLoop(null)
      mindarThree.stop()
      restoreOriginal()
    }
  }, [])

  return (
    <div style={{ width: "100%", height: "100%" }} ref={containerRef}></div>
  )
}
