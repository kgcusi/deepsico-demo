export const mockWithImage = (path) => {
  const originalGetUserMedia = navigator.mediaDevices.getUserMedia // Store original function

  navigator.mediaDevices.getUserMedia = () => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      const image = new Image()
      image.onload = () => {
        canvas.width = image.width
        canvas.height = image.height
        context.drawImage(image, 0, 0, image.width, image.height)
        const stream = canvas.captureStream()
        resolve(stream)
      }
      image.onerror = (err) => {
        reject(err)
      }
      image.src = path
    })
  }

  return () => {
    navigator.mediaDevices.getUserMedia = originalGetUserMedia // Restore original function when done
  }
}
