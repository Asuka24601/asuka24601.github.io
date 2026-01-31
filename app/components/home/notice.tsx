/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import AriticleContene from '../aritcleContent'
import NoticeModule from '../../contents/pages/Notice'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

const PC_ASCII = `
 ________________
|  ___________   |
| |           |  |
| |  SYSTEM   |  |
| |  ONLINE   |  |
| |___________|  |
|________________|
   _[_______]_
  |___________|
`

function Neofetch() {
    const [uptime, setUptime] = useState<string>('')
    const [resolution, setResolution] = useState<string>('')

    useEffect(() => {
        // Mock uptime calculation
        const start = new Date().setHours(0, 0, 0, 0)
        const now = new Date().getTime()
        const diff = now - start
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setUptime(`${hours}h ${mins}m`)

        if (typeof window !== 'undefined') {
            setResolution(`${window.screen.width}x${window.screen.height}`)
        }
    }, [])

    const info = [
        { label: 'OS', value: 'React Router v7 (Web)' },
        { label: 'Host', value: 'Blog_Instance_01' },
        { label: 'Kernel', value: 'React 19.0.0' },
        { label: 'Uptime', value: uptime || 'Calculating...' },
        { label: 'Resolution', value: resolution || 'Unknown' },
        { label: 'Shell', value: 'Zsh (Simulated)' },
        { label: 'Theme', value: 'Retro Terminal' },
        { label: 'CPU', value: 'Client Side Rendering' },
    ]

    return (
        <div className="mb-6 flex flex-col items-center gap-6 font-mono text-xs lg:flex-row lg:items-start lg:text-sm">
            <pre className="text-primary hidden leading-tight font-bold opacity-80 select-none lg:block">
                {PC_ASCII}
            </pre>
            <div className="flex w-full flex-col gap-1">
                <div className="mb-2 flex gap-2">
                    <span className="text-secondary font-bold">root@blog</span>
                    <span className="text-white/50">on</span>
                    <span className="text-secondary font-bold">~</span>
                </div>
                {info.map((item) => (
                    <div key={item.label} className="flex gap-2">
                        <span className="text-primary min-w-25 font-bold">
                            {item.label}:
                        </span>
                        <span className="text-white/80">{item.value}</span>
                    </div>
                ))}

                {/* Color palette strip */}
                <div className="mt-3 flex gap-1">
                    <div className="h-3 w-3 bg-black"></div>
                    <div className="h-3 w-3 bg-red-500"></div>
                    <div className="h-3 w-3 bg-green-500"></div>
                    <div className="h-3 w-3 bg-yellow-500"></div>
                    <div className="h-3 w-3 bg-blue-500"></div>
                    <div className="h-3 w-3 bg-purple-500"></div>
                    <div className="h-3 w-3 bg-cyan-500"></div>
                    <div className="h-3 w-3 bg-white"></div>
                </div>
            </div>
        </div>
    )
}

export default function Notice({ className }: { className?: string }) {
    return (
        <div className={'w-full font-mono text-sm ' + (className || '')}>
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-primary/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_SYSTEM_ANNOUNCEMENT']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['NOTICE\_BOARD']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['PRIORITY']"></div>
                            <div className="text-warning animate-pulse text-xs opacity-70 before:content-['HIGH']"></div>
                        </div>
                    </div>

                    <div className="p-2 lg:p-4">
                        <Neofetch />

                        <div className="my-4 border-t border-dashed border-white/10"></div>

                        <div className="relative">
                            <div className="mb-2 text-[10px] text-white/50 uppercase">
                                Message_Body
                            </div>
                            <AriticleContene className="font-mono">
                                <NoticeModule />
                            </AriticleContene>
                        </div>
                    </div>

                    <div className="text-base-100 mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_END_OF_NOTICE']"></span>
                        <span className="ml-1 animate-pulse before:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
