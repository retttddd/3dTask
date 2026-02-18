import {
    BACKGROUND_COLOR,
    BASE_DEPTH,
    DOT_SIZE,
    FOREGROUND_COLOR,
    ZOOM_SENSITIVITY,
} from "./constants"
import React from "react";

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
    ctx.fillStyle = FOREGROUND_COLOR
    ctx.fillRect(
        p.x - DOT_SIZE / 2,
        p.y - DOT_SIZE / 2,
        DOT_SIZE,
        DOT_SIZE
    )
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

let animationIdZTranslation: number | null = null

const translateZ = (p: DimensionPoint, dz: number): DimensionPoint => ({...p, z: p.z + dz})

const rotateXZ = (p: DimensionPoint, angleRotation: number): DimensionPoint => {
    const c = Math.cos(angleRotation);
    const s = Math.sin(angleRotation);
    return {
        x: p.x * c - p.z * s,
        y: p.y,
        z: p.x * s + p.z * c,
    }
}

const rotateXY = (p: DimensionPoint, angleRotation: number): DimensionPoint => {
    const c = Math.cos(angleRotation);
    const s = Math.sin(angleRotation);
    return {
        x: p.x,
        y: p.y * c - p.z * s,
        z: p.y * s + p.z * c,
    }
}

export function animate(
    points: DimensionPoint[],
    ctx: CanvasRenderingContext2D,
    movingZRef: React.MutableRefObject<number>,
    rotationAngleRef: React.MutableRefObject<number>,
    rotationAngleXYRef: React.MutableRefObject<number>
) {
    const angleXZ = rotationAngleRef.current
    const angleXY = rotationAngleXYRef.current
    const movingZ = movingZRef.current
    const dz = BASE_DEPTH - movingZ * ZOOM_SENSITIVITY
    clearCanvas(ctx)

    for (const d of points) {
        const transformed = translateZ(rotateXY(rotateXZ(d, angleXZ), angleXY), dz)
        const projected = screen(project(transformed), ctx.canvas.width, ctx.canvas.height)
        placePoint(projected, ctx)
    }

    animationIdZTranslation = requestAnimationFrame(() => animate(points, ctx, movingZRef, rotationAngleRef, rotationAngleXYRef))
}

export function stopAnimation() {
    if (animationIdZTranslation != null) {
        cancelAnimationFrame(animationIdZTranslation)
        animationIdZTranslation = null
    }
}
