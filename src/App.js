import React, { useState } from "react"
import "./App.css"
import MindARMock from "./mindar-mock"
import MindARVideo from "./mindar-camera"
import artbatMind from "./targets/artbat_logo.mind"
import lotusFlowerMind from "./targets/lotus-flower.mind"

function App() {
  const [started, setStarted] = useState(null)

  return (
    <div className="App">
      <h1>Deepsico Augmented Reality Demo</h1>
      <div className="control-buttons">
        {started === null && (
          <button
            onClick={() => {
              setStarted("video-lotus")
            }}
          >
            Start Video Lotus version
          </button>
        )}
        {started === null && (
          <button
            onClick={() => {
              setStarted("mock-lotus")
            }}
          >
            Start Mock Lotus version
          </button>
        )}
        {started === null && (
          <button
            onClick={() => {
              setStarted("video-artbat")
            }}
          >
            Start Video Artbat version
          </button>
        )}
        {started === null && (
          <button
            onClick={() => {
              setStarted("mock-artbat")
            }}
          >
            Start Mock Artbat version
          </button>
        )}
        {started !== null && (
          <button
            onClick={() => {
              setStarted(null)
            }}
          >
            Stop
          </button>
        )}
      </div>

      {started === "mock-lotus" && (
        <div className="container">
          <MindARMock
            image="./images/lotus-flower.jpg"
            target={lotusFlowerMind}
          />
          <video></video>
        </div>
      )}

      {started === "video-lotus" && (
        <div className="container">
          <MindARVideo target={lotusFlowerMind} />
          <video></video>
        </div>
      )}
      {started === "mock-artbat" && (
        <div className="container">
          <MindARMock image="./images/zoomed_out.jpg" target={artbatMind} />
          <video></video>
        </div>
      )}

      {started === "video-artbat" && (
        <div className="container">
          <MindARVideo target={artbatMind} />
          <video></video>
        </div>
      )}
    </div>
  )
}

export default App
