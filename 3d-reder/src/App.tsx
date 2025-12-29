import {useEffect, useRef, useState} from "react"
import "./App.css"
import {
    placePoint,
    clearCanvas,
    animate,
    screen,
    stopAnimation,
    type DimensionPoint,
    project
} from "./utils"

function App() {

    const [zIndex, setZIndex] = useState(-0.5)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    let vs = [
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
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        if (!canvas || !ctx) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        const px = (e.clientX - rect.left) * scaleX
        const py = (e.clientY - rect.top) * scaleY
        const ndcX = (px / canvas.width) * 2 - 1
        const ndcY = -((py / canvas.height) * 2 - 1)

        const point3D: DimensionPoint = {
            x: ndcX * zIndex,
            y: ndcY * zIndex,
            z: zIndex,
        }

        const projected = project(point3D)
        const screenPt = screen(projected, canvas.width, canvas.height)
        placePoint(screenPt, ctx)
        vs.push(point3D)
    }

    const animateZ = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        animate(vs, ctx);

    }

    const clearCanvasWrapper = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        stopAnimation()
        vs = [];
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
