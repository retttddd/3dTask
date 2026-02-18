import {DOT_SIZE} from "./constants"
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

const FOREGROUND = "#50FF50"
const LINE_WIDTH = 3
const BASE_DEPTH = 2
const NEAR_CLIP = 0.05
const ZOOM_SENSITIVITY = 0.2
const CONNECTION_DISTANCE = 0.2
const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE

export function line(p1: Point, p2: Point, ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = LINE_WIDTH
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
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
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(
        p.x - DOT_SIZE / 2,
        p.y - DOT_SIZE / 2,
        DOT_SIZE,
        DOT_SIZE
    )
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

let angle = 0
let angleXY = 0
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
    angle = rotationAngleRef.current
    angleXY = rotationAngleXYRef.current
    const movingZ = movingZRef.current
    const dz = BASE_DEPTH - movingZ * ZOOM_SENSITIVITY
    clearCanvas(ctx)

    const visiblePoints: { world: DimensionPoint; screen: Point }[] = []
    for (const d of points) {
        const transformed = translateZ(rotateXY(rotateXZ(d, angle), angleXY), dz)
        if (transformed.z <= NEAR_CLIP) continue
        const projected = screen(project(transformed), ctx.canvas.width, ctx.canvas.height)
        visiblePoints.push({ world: transformed, screen: projected })
        placePoint(projected, ctx)
    }

    for (let i = 0; i < visiblePoints.length; i += 1) {
        const a = visiblePoints[i]
        for (let j = i + 1; j < visiblePoints.length; j += 1) {
            const b = visiblePoints[j]
            const dx = a.world.x - b.world.x
            const dy = a.world.y - b.world.y
            const dz = a.world.z - b.world.z
            const distanceSq = dx * dx + dy * dy + dz * dz
            if (distanceSq <= CONNECTION_DISTANCE_SQ) {
                line(a.screen, b.screen, ctx)
            }
        }
    }


    animationIdZTranslation = requestAnimationFrame(() => animate(points, ctx, movingZRef, rotationAngleRef, rotationAngleXYRef))
}

export function stopAnimation() {
    if (animationIdZTranslation != null) {
        cancelAnimationFrame(animationIdZTranslation)
        angle = 0;
        angleXY = 0;
    }
}
