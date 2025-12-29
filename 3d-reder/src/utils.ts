import {DELTA_TIME, DOT_SIZE} from "./constants"

export type Point = {
    x: number
    y: number
}

export type DimensionPoint = {
    x: number
    y: number
    z: number
}

export function screen(p: Point, width: number, height: number): Point {
    return {
        x: ((p.x + 1) / 2) * width,
        y: (1 - (p.y + 1) / 2) * height
    }
}

export function project(p: DimensionPoint): Point {
    return {
        x: p.x / p.z,
        y: p.y / p.z
    }
}

export function placePoint(p: Point, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green"
    ctx.fillRect(
        p.x - DOT_SIZE / 2,
        p.y - DOT_SIZE / 2,
        DOT_SIZE,
        DOT_SIZE
    )
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

let dz = 0
let angle = 0
let animationIdZTranslation: number | null = null

const translateZ = (p: DimensionPoint, deltaZ:number) => ({...p, z: p.z + deltaZ})

const rotate= (p: DimensionPoint, angleRotation: number)=> {
    const c = Math.cos(angleRotation);
    const s = Math.sin(angleRotation);
    return {
        x: p.x*c-p.z*s,
        y: p.y,
        z: p.x*s+p.z*c,
    }
    };

export function animate(points: DimensionPoint[], ctx: CanvasRenderingContext2D) {
    dz += 1 * DELTA_TIME
    angle +=  1 * DELTA_TIME
    clearCanvas(ctx)

    for (const d of points) {
        placePoint(screen(project(rotate(d, angle)), ctx.canvas.width, ctx.canvas.height), ctx)
    }


    animationIdZTranslation = requestAnimationFrame(() => animate(points, ctx))
}

// Stop the animation
export function stopAnimation() {
    if (animationIdZTranslation != null) {
        cancelAnimationFrame(animationIdZTranslation)
        angle = 0;
        dz = 0;
    }
}
