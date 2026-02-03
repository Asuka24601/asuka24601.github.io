import earth_daymap from '../../assets/2k_earth_daymap.webp'
import earth_normal_map from '../../assets/2k_earth_normal_map.webp'
import earth_specular_map from '../../assets/2k_earth_specular_map.webp'
import earth_nightmap from '../../assets/2k_earth_nightmap.webp'
import earth_clouds from '../../assets/2k_earth_clouds.webp'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Html, OrbitControls, Stars, useTexture } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

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
                <div className="text-base-content/80 text-xs font-thin">
                    Loading...
                </div>
            </Html>
        </mesh>
    )
}

const targetScale = new THREE.Vector3(1, 1, 1)

const EarthObj = () => {
    const hours = new Date().getHours()

    const earthRef = useRef<THREE.Mesh>(null)
    const cloudsRef = useRef<THREE.Mesh>(null)

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
        earthRef.current.rotation.y = elapsedTime / 6
        cloudsRef.current.rotation.y = elapsedTime / 5 // 云层转速稍快
        earthRef.current.scale.lerp(targetScale, delta * 2.5)
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

const Earth = () => {
    const [inView, setInView] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting)
            },
            { threshold: 0 }
        )
        if (containerRef.current) {
            observer.observe(containerRef.current)
        }
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!inView) return
        const interval = setInterval(() => {
            clearInterval(interval)
        }, 100)
        return () => {
            clearInterval(interval)
        }
    }, [inView])

    return (
        <div className="absolute z-0 h-full w-full" ref={containerRef}>
            {/* 设置一个容器让 Canvas 撑满 */}

            <Canvas
                camera={{ position: [0, 0, 5] }}
                frameloop={inView ? 'always' : 'never'}
            >
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
                    <EarthObj />
                </Suspense>
                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
    )
}

export default Earth
