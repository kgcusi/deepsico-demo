export const mockWithImage = (path) => {
  // Check if navigator.mediaDevices is supported
  if (!navigator.mediaDevices) {
    console.error("navigator.mediaDevices is not supported in this browser.")
    return
  }

  const originalGetUserMedia = navigator.mediaDevices.getUserMedia
  let canvas, context

  navigator.mediaDevices.getUserMedia = async () => {
    if (!canvas) {
      canvas = document.createElement("canvas")
      context = canvas.getContext("2d")
    }

    try {
      const image = new Image()
      const imageLoadPromise = new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = () => {
          const error = new Error(`Error loading image from path: ${path}`)
          console.error("Image Load Error: ", error)
          reject(error)
        }
      })

      image.src = path
      await imageLoadPromise

      canvas.width = image.width
      canvas.height = image.height
      context.drawImage(image, 0, 0, image.width, image.height)
      return canvas.captureStream()
    } catch (err) {
      throw new Error(`Error loading image: ${err.message}`)
    }
  }

  return () => {
    navigator.mediaDevices.getUserMedia = originalGetUserMedia
  }
}
