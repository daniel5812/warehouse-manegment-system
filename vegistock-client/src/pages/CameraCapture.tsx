import { useRef, useState } from 'react'

const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [detected, setDetected] = useState<string | null>(null)

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }

  const captureAndSend = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // קובע את גודל הקנבס לגודל הוידאו
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight

    // מצייר את התמונה מתוך הוידאו לקנבס
    ctx.drawImage(videoRef.current, 0, 0)

    // לוקח את התמונה מהקנבס
    const dataUrl = canvasRef.current.toDataURL('image/jpeg')

    try {
      const res = await fetch('http://localhost:5000/api/detect-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl })
      })

      const result = await res.json()
      setDetected(`${result.itemName} (${Math.round(result.confidence * 100)}%)`)
    } catch (error) {
      console.error('Error sending image:', error)
      alert('Failed to send image to server')
    }
  }

  return (
    <div className="page">
      <h1>Camera Capture</h1>

      <video ref={videoRef} autoPlay style={{ width: '300px', border: '1px solid gray' }} />

      <br />

      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureAndSend}>Capture & Detect</button>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {detected && (
        <p>
          <strong>Detected:</strong> {detected}
        </p>
      )}
    </div>
  )
}

export default CameraCapture
