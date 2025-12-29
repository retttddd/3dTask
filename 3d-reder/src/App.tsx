import { useEffect, useRef } from "react"
import "./App.css"
import {placePoint, type Point, clearCanvas, animateZTranslation, stopAnimation} from "./utils"

function App() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const vs = [
        {x: -1, y: 0.5, z: 0.5},
        {x: 1, y: 0.5, z: 0.5},
        {x: 1, y: -0.5, z: 0.5},
        {x: -1, y: -0.5, z: 0.5},
        {x: -1, y: 0.5, z: -0.5},
        {x: 1, y: 0.5, z: -0.5},
        {x: 1, y: -0.5, z: -0.5},
        {x: -1, y: -0.5, z: -0.5},

    ]

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const ctx = ctxRef.current
        if (!canvas || !ctx) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const point: Point = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        }

        placePoint(point, ctx)
    }

    const animateZ = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        animateZTranslation(vs, ctx);

    }

    const clearCanvasWrapper = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        stopAnimation()
         clearCanvas(ctx)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const ctx = canvas.getContext("2d")
        if (!ctx) return
    }, [])



    return (
        <>
            <header>
                <h1>Example table</h1>
            </header>

            <section>
                <button onClick={() => clearCanvasWrapper()}>
                    Clear
                </button>
                <button onClick={() => animateZ()}>
                    animate z translation
                </button>

                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    style={{
                        width: "100%",
                        height: "100vh",
                        border: "1px solid red"
                    }}
                />
            </section>
        </>
    )
}

export default App
