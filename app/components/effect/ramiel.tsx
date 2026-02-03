/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Edges, Billboard } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// 顶点着色器：计算必要变量传递给片元（法线、视图方向用于 Fresnel）
const vertexShader = `
  varying vec3 vViewPosition;
  varying vec3 vPos;

  void main() {
    vPos = position;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vViewPosition = -viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`

// 片元着色器：核心逻辑，实现晶体/镜面/折射/Fresnel
const fragmentShader = `
//   #extension GL_OES_standard_derivatives : enable
  uniform vec3 uColor; // 基色（冰蓝）
  uniform float uRoughness; // 粗糙度（低值=镜面强）
  uniform float uMetalness; // 金属感
  uniform float uTransmission; // 传输/折射强度
  uniform float uIor; // 折射率
  uniform float uTime; // 时间用于脉动

  varying vec3 vViewPosition;
  varying vec3 vPos;

  // 简单 Fresnel 函数（边缘高光）
  float fresnel(vec3 I, vec3 N, float bias, float scale, float power) {
    return bias + scale * pow(1.0 - abs(dot(I, N)), power);
  }

  void main() {
    // 2. 动态计算面法线：使用导数计算硬边法线，实现完美的晶体切割感，解决平滑插值导致的“软边”
    vec3 fdx = dFdx(vViewPosition);
    vec3 fdy = dFdy(vViewPosition);
    vec3 N = normalize(cross(fdx, fdy));
    vec3 I = normalize(vViewPosition);
    
    // 确保法线朝向摄像机（修复部分角度变黑的问题）
    if (dot(N, I) < 0.0) N = -N;

    // Fresnel 边缘发光（雷天使的晶莹感）
    float fresnelFactor = fresnel(I, N, 0.04, 1.0, 5.0);
    
    // 基色 + 高光混合（偏蓝白）
    vec3 color = uColor * (1.0 - uRoughness) + vec3(1.0, 1.0, 1.0) * fresnelFactor * uMetalness;
    
    // 模拟折射/传输（半透明）
    float alpha = 1.0 - uTransmission * (1.0 - fresnelFactor);
    
    // 添加轻微脉动（能量感）
    // 内部能量流动（核心发光 + 垂直波纹）
    float innerGlow = pow(max(0.0, dot(I, N)), 4.0); // 反向 Fresnel：聚焦中心
    float flow = 0.5 + 0.5 * sin(vPos.y * 10.0 + uTime * 3.0); // 沿 Y 轴流动的波纹
    color += vec3(0.4, 0.8, 1.0) * innerGlow * flow * 0.15; // 叠加微弱的青蓝色流光
    
    // 最终输出（锐利镜面通过低粗糙实现）
    gl_FragColor = vec4(color, alpha);
  }
`

// A.T. Field 着色器：同心八边形 + 空间破碎扭曲
const atFieldVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const atFieldFragmentShader = `
  uniform float uTime;
  uniform float uProgress; // 0.0 (开始) -> 1.0 (结束)
  varying vec2 vUv;

  // 伪随机噪声
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    
    // 1. 空间破碎感：基于进度的 UV 强扭曲
    // 在生成初期 (uProgress < 0.2) 施加剧烈的随机偏移，模拟空间震荡
    float glitch = (random(uv + uTime) - 0.5) * 0.2 * (1.0 - smoothstep(0.0, 0.3, uProgress));
    uv += glitch;

    // 2. 八边形 SDF (距离场)
    // max(|x|, |y|) 是正方形，(|x|+|y|)/sqrt(2) 是旋转45度的正方形
    // 取二者最大值即为八边形
    float d1 = max(abs(uv.x), abs(uv.y));
    float d2 = (abs(uv.x) + abs(uv.y)) / 1.4142;
    float dist = max(d1, d2);

    // 3. 同心波纹图案
    // 使用 sin 函数生成环，并随时间向外扩散
    float rings = abs(sin(dist * 30.0 - uTime * 8.0));
    // 锐化环的边缘，使其看起来像光之壁
    float lines = smoothstep(0.85, 0.95, rings);

    // 4. 颜色定义 (经典的橙金色)
    vec3 color = vec3(1.0, 0.65, 0.1);
    // 核心高亮：越靠近中心越亮
    color += vec3(1.0, 0.8, 0.5) * (1.0 - dist);
    // Bloom 增强：增加亮度倍数，配合后期泛光
    color *= 3.0;

    // 5. 遮罩与动画逻辑
    // 展开动画：mask 从中心向外变大
    float expandRadius = uProgress * 2.5; 
    float mask = smoothstep(expandRadius, expandRadius - 0.2, dist); // 外圈淡出
    
    // 整体透明度：
    // - lines: 纹理本身
    // - mask: 展开范围
    // - fade: 随进度淡出 (0.5 -> 1.0 期间慢慢消失)
    float fade = 1.0 - smoothstep(0.4, 1.0, uProgress);
    
    // 初始闪光：刚生成时极亮
    float flash = smoothstep(0.0, 0.1, uProgress) * (1.0 - smoothstep(0.1, 0.3, uProgress));
    color += vec3(1.0) * flash * 5.0;

    float alpha = (lines * 0.8 + 0.2) * mask * fade;

    // 修复：边缘柔和淡出，防止网格截断造成的突兀边界
    alpha *= smoothstep(1.0, 0.6, dist);

    gl_FragColor = vec4(color, alpha);
  }
`

const RamielOctahedron = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    const [atFields, setAtFields] = useState<
        { id: number; position: THREE.Vector3 }[]
    >([])
    const fieldIdCounter = useRef(0)

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(0x88ccff) }, // 冰蓝
            uRoughness: { value: 0.02 }, // 极低粗糙 = 强镜面
            uMetalness: { value: 0.95 }, // 高金属感
            uTransmission: { value: 0.025 }, // 低传输 = 实心感
            uIor: { value: 1.8 }, // 折射率（水晶）
        }),
        []
    )

    // 动画：更新时间 uniform，实现脉动
    useFrame(({ clock }) => {
        const material = meshRef.current?.material as THREE.ShaderMaterial
        if (!material) return
        const t = clock.getElapsedTime()
        material.uniforms.uTime.value = t
        meshRef.current!.rotation.y += 0.003

        // 脉动效果移至 CPU，以便 Edges 组件能同步缩放
        // 原 Shader 逻辑等效于：1.0 + sin(t * 3.0) * (0.05 / 2.0)
        const scale = 1.0 + Math.sin(t * 3.0) * 0.025
        meshRef.current!.scale.setScalar(scale)
    })

    // 点击触发 A.T. Field
    const handleClick = (e: any) => {
        e.stopPropagation() // 防止穿透
        const newId = fieldIdCounter.current++

        // 计算从点击点指向摄像机的方向向量
        const toCamera = e.camera.position.clone().sub(e.point).normalize()
        // 将生成点沿着视线向摄像机移动 2.0 单位，使其悬浮在模型前方，营造“屏幕即立场”的感觉
        const spawnPos = e.point.clone().add(toCamera.multiplyScalar(2.0))

        setAtFields((prev) => [...prev, { id: newId, position: spawnPos }])
    }

    return (
        <group>
            <mesh ref={meshRef} onClick={handleClick}>
                <octahedronGeometry args={[2, 0]} /> {/* radius=2, detail=0 */}
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    extensions={{ derivatives: true } as any}
                    transparent={true}
                    side={THREE.FrontSide}
                />
                {/* 改为明亮的青色描边，表现出轮廓发光感 */}
                <Edges color="#000000" scale={1.005} threshold={15} />
            </mesh>

            {/* 渲染所有激活的 A.T. Fields */}
            {atFields.map((field) => (
                <ATField
                    key={field.id}
                    position={field.position}
                    onComplete={() => {
                        setAtFields((prev) =>
                            prev.filter((f) => f.id !== field.id)
                        )
                    }}
                />
            ))}
        </group>
    )
}

// A.T. Field 组件
const ATField = ({
    onComplete,
    position,
}: {
    onComplete: () => void
    position: THREE.Vector3
}) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null)

    useFrame(({ clock }, delta) => {
        if (materialRef.current) {
            // 动画进度：0 -> 1
            // 速度 1.2 表示约 0.8 秒完成动画
            materialRef.current.uniforms.uProgress.value += delta * 2
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime()

            if (materialRef.current.uniforms.uProgress.value >= 1.0) {
                onComplete()
            }
        }
    })

    return (
        <Billboard position={position}>
            <mesh scale={[1, 1, 1]}>
                <planeGeometry args={[1, 1]} />
                <shaderMaterial
                    ref={materialRef}
                    transparent={true}
                    depthWrite={false} // 不遮挡后方物体
                    blending={THREE.AdditiveBlending} // 叠加混合，增强光效
                    vertexShader={atFieldVertexShader}
                    fragmentShader={atFieldFragmentShader}
                    uniforms={{
                        uTime: { value: 0 },
                        uProgress: { value: 0 },
                    }}
                />
            </mesh>
        </Billboard>
    )
}

const RamielScene = () => {
    const controlsRef = useRef<any>(null) // OrbitControls 的 ref
    const [isResetting, setIsResetting] = useState(false)

    useEffect(() => {
        const controls = controlsRef.current
        if (!controls) return

        // 保存初始状态（创建时自动调用 saveState，但显式确保）
        controls.saveState()

        let timeoutId: any

        const onStart = () => {
            clearTimeout(timeoutId)
            setIsResetting(false) // 用户开始操作，打断回正动画
        }

        const onEnd = () => {
            // 清除之前的定时器
            clearTimeout(timeoutId)

            // 1.8秒后开始触发回正动画
            timeoutId = setTimeout(() => {
                setIsResetting(true)
            }, 1800)
        }

        controls.addEventListener('start', onStart)
        controls.addEventListener('end', onEnd)

        return () => {
            clearTimeout(timeoutId)
            controls.removeEventListener('start', onStart)
            controls.removeEventListener('end', onEnd)
        }
    }, [])

    useFrame((_state, delta) => {
        const controls = controlsRef.current
        if (isResetting && controls) {
            // 使用 lerp 平滑地将相机位置和目标点插值到初始状态
            // delta * 2.5 是动画速度，可以调整
            controls.object.position.lerp(controls.position0, delta * 2.5)
            controls.target.lerp(controls.target0, delta * 2.5)

            // 当相机位置足够接近目标时，停止动画并直接设置到最终位置，避免无限 lerp
            if (
                controls.object.position.distanceTo(controls.position0) < 0.01
            ) {
                controls.object.position.copy(controls.position0)
                controls.target.copy(controls.target0)
                setIsResetting(false)
            }
        }
    })

    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={3} />
            <directionalLight
                position={[-6, -4, 7]}
                intensity={2.5}
                color={0x88ccff}
            />
            <pointLight position={[0, 0, 10]} intensity={1.5} />
            <RamielOctahedron />
            <OrbitControls
                ref={controlsRef}
                enableDamping
                rotateSpeed={0.8}
                dampingFactor={0.05}
                enableZoom={false}
            />
            <EffectComposer>
                {/* mipmapBlur: 使用高质量模糊，产生柔和的天使光晕；luminanceThreshold: 亮度超过多少开始发光 */}
                <Bloom
                    luminanceThreshold={0.55}
                    mipmapBlur
                    intensity={1}
                    radius={0.6}
                />
            </EffectComposer>
        </>
    )
}

const Ramiel = () => {
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
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                <RamielScene />
            </Canvas>
        </div>
    )
}

export default Ramiel
