/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useEffect, useRef, useState } from 'react'
// 1. 引入 R3F 的核心组件
import { Canvas, useFrame } from '@react-three/fiber'

import { Html, OrbitControls, Stars, useTexture } from '@react-three/drei'
import * as THREE from 'three'

import earth_daymap from '../../assets/2k_earth_daymap.webp'
import earth_normal_map from '../../assets/2k_earth_normal_map.webp'
import earth_specular_map from '../../assets/2k_earth_specular_map.webp'
import earth_nightmap from '../../assets/2k_earth_nightmap.webp'
import earth_clouds from '../../assets/2k_earth_clouds.webp'

const targetScale = new THREE.Vector3(1, 1, 1)

const Loader = () => {
    const ref = useRef<THREE.Mesh>(null)
    // 让加载图标持续旋转
    useFrame((_state, delta) => {
        if (!ref.current) return
        ref.current.rotation.x += delta
        ref.current.rotation.y += delta
    })
    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
                wireframe
                color="white"
                transparent
                opacity={0.3}
            />
            <Html center>
                <div className="text-xs font-thin text-white/80">
                    Loading...
                </div>
            </Html>
        </mesh>
    )
}

const Earth = () => {
    const hours = new Date().getHours()

    const earthRef = useRef(null)
    const cloudsRef = useRef(null)

    // 加载纹理 (替换为你的图片路径)
    const [colorMap, bumpMap, specularMap, nightMap, cloudMap] = useTexture([
        earth_daymap,
        earth_normal_map,
        earth_specular_map,
        earth_nightmap,
        earth_clouds,
    ])

    // 每一帧更新旋转
    useFrame(({ clock }, delta) => {
        const elapsedTime = clock.getElapsedTime()
        if (!earthRef.current || !cloudsRef.current) return
        // @ts-ignore
        earthRef.current.rotation.y = elapsedTime / 6
        // @ts-ignore
        cloudsRef.current.rotation.y = elapsedTime / 5 // 云层转速稍快
        // @ts-ignore
        earthRef.current.scale.lerp(targetScale, delta * 2.5)
        // @ts-ignore
        cloudsRef.current.scale.lerp(targetScale, delta * 2.5)
    })

    return (
        <>
            {/* 太阳光照射 */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 5, 5]} intensity={1.5} />

            {/* 地球本体 */}
            <mesh ref={earthRef} scale={[0, 0, 0]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhongMaterial
                    map={hours < 18 && hours > 6 ? colorMap : nightMap}
                    normalMap={bumpMap}
                    specularMap={specularMap}
                    shininess={5}
                />
            </mesh>

            {/* 云层外壳 */}
            <mesh ref={cloudsRef} scale={[0, 0, 0]}>
                <sphereGeometry args={[2.02, 64, 64]} />
                <meshPhongMaterial
                    map={cloudMap}
                    transparent={true}
                    opacity={0.4}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    )
}

/**
 * 主组件
 * 包含 Canvas 画布和场景设置
 */
export default function PrologueComponent({
    className,
    style,
    children,
    fullText,
}: {
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
    fullText?: string
}) {
    const [desplayText, setDespalyText] = useState('')

    useEffect(() => {
        if (!fullText) return
        let index = 0
        const interval = setInterval(() => {
            setDespalyText(fullText.slice(0, index))
            index++
            if (index > fullText.length) {
                clearInterval(interval)
            }
        }, 100)
        return () => clearInterval(interval)
    }, [fullText])

    return (
        <div className={className} style={style}>
            {/* 设置一个容器让 Canvas 撑满 */}
            <div className="absolute z-0 h-full w-full">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    {/* 添加光源，否则 MeshStandardMaterial 看起来是黑色的 */}
                    {/* 环境光：均匀照亮所有物体 */}
                    <ambientLight intensity={1.5} />
                    {/* 点光源：模拟一个灯泡，产生高光和阴影感 */}
                    <pointLight position={[10, 10, 10]} />

                    <Stars
                        radius={300}
                        depth={60}
                        count={20000}
                        factor={7}
                        saturation={0}
                        fade
                    />

                    <Suspense fallback={<Loader />}>
                        <Earth />
                    </Suspense>
                    <OrbitControls enableZoom={false} />
                </Canvas>
            </div>

            <div className="z-1">
                {children || (
                    <p className="text-base-100 text-7xl text-shadow-2xs">
                        {desplayText}{' '}
                        <span className="animate__animated animate__flash animate__infinite animate__slow inline-block select-none">
                            l
                        </span>
                    </p>
                )}
            </div>
        </div>
    )
}
