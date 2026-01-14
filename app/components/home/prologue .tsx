/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react'
// 1. 引入 R3F 的核心组件
import { Canvas, useFrame } from '@react-three/fiber'

/**
 * 甜甜圈组件 (Donut Mesh)
 * 这实际上是一个 Three.js 的 Mesh 对象，只不过用 JSX 写出来
 */
function Donut(props: any) {
    // 创建一个 ref 来引用这个 3D 网格模型
    const meshRef = useRef(null)

    // 设置状态用于鼠标悬停交互
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    // 2. 使用 useFrame 钩子实现动画
    // 这个回调函数会在每一帧渲染前执行 (类似 requestAnimationFrame)
    useFrame((state, delta) => {
        // delta 是两帧之间的时间间隔，乘以它可以确保动画速度在不同帧率下保持一致
        // 让它绕 X 轴和 Y 轴同时旋转
        if (!meshRef.current) return
        // @ts-ignore
        meshRef.current.rotation.x += delta * 0.5
        // @ts-ignore
        meshRef.current.rotation.y += delta * 1
    })

    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1} // 点击时放大
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            {/* 3. 几何体：TorusGeometry 是甜甜圈的形状 */}
            {/* args: [甜甜圈半径, 管道半径, 径向分段数, 管状分段数] */}
            <torusGeometry args={[1, 0.4, 16, 100]} />

            {/* 4. 材质：MeshStandardMaterial 是一种会对光照产生反应的标准材质 */}
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

/**
 * 主组件
 * 包含 Canvas 画布和场景设置
 */
export default function PrologueComponent({
    className,
    style,
}: {
    className?: string
    style?: React.CSSProperties
}) {
    return (
        // 设置一个容器让 Canvas 撑满
        <div className={className} style={style}>
            {/* R3F 的 Canvas 组件，它会自动创建 WebGL 上下文 */}
            <Canvas camera={{ position: [0, 0, 5] }}>
                {/* 添加光源，否则 MeshStandardMaterial 看起来是黑色的 */}
                {/* 环境光：均匀照亮所有物体 */}
                <ambientLight intensity={0.5} />
                {/* 点光源：模拟一个灯泡，产生高光和阴影感 */}
                <pointLight position={[10, 10, 10]} />

                {/* 放入甜甜圈组件 */}
                <Donut position={[0, 0, 0]} />
            </Canvas>
        </div>
    )
}
