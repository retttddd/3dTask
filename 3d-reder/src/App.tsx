import {useCallback, useEffect, useRef, useState} from "react"
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
import Slider from "./components /Slider.tsx";

function App() {

    const [zIndex, setZIndex] = useState(-0.5)
    const [movingZ, setMovingZ] = useState(0)
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

    const movingZRef = useRef<number>(0);

    useEffect(() => {
        movingZRef.current = movingZ;
    }, [movingZ]);

    const animateZ = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        animate(vs, ctx, movingZRef);
    }, [movingZ]);
    const clearCanvasWrapper = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        stopAnimation()
        vs = [];
        clearCanvas(ctx)
        window.location.reload()
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
        <div style={{
            margin: 0,
            padding: 0,
            width: '75vw',
            height: '100vh',
            overflow: 'hidden',
            background: '#fafafa',
        }}>
            <header style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '24px 32px',
                background: '#1e1f22',
                zIndex: 100
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 400,
                    color: '#999',
                    letterSpacing: '0.5px'
                }}>
                    3D Playground
                </h1>
            </header>
            <div style={{
                position: 'absolute',
                top: '80px',
                left: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 100
            }}>
                <button
                    onClick={() => clearCanvasWrapper()}
                    style={{
                        padding: '8px 16px',
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#666',
                        background: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f5f5';
                        e.currentTarget.style.borderColor = '#ccc';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                >
                    Clear
                </button>
                <button
                    onClick={() => animateZ()}
                    style={{
                        padding: '8px 16px',
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#666',
                        background: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f5f5';
                        e.currentTarget.style.borderColor = '#ccc';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                >
                    Animate
                </button>
                <Slider value={movingZ} min={-10} max={10} onChange={setMovingZ} />
            </div>

            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'crosshair'
                }}
            />
        </div>
    )
}

export default App
