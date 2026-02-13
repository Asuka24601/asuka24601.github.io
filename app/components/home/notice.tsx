/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { memo, useEffect, useState } from 'react'
import AriticleContene from '../aritcleContent'
import NoticeModule from '../../contents/pages/notice/index'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

import { create } from 'zustand'
import type { MenuItemStore } from '../../interfaces/menuItem'

const useMenuItemStore = create<MenuItemStore>()((set) => ({
    open: true,
    setMenuItemState: (usr) => set({ open: usr }),
}))

const MenuItem = () => {
    const setMenuItemOpen = useMenuItemStore((state) => state.setMenuItemState)

    const handleClick = () => {
        setMenuItemOpen(true)
    }

    return (
        <>
            <div className="aspect-square h-full w-auto">
                <button className="btn h-full w-full" onClick={handleClick}>
                    P
                </button>
            </div>
        </>
    )
}

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
    const [browser, setBrowser] = useState<string>('Unknown')
    const [os, setOs] = useState<string>('Unknown')
    const [language, setLanguage] = useState<string>('Unknown')
    const [hardware, setHardware] = useState<string>('Unknown')
    const [connection, setConnection] = useState<string>('Unknown')
    const [timezone, setTimezone] = useState<string>('Unknown')

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

            const ua = navigator.userAgent
            let browserName = 'Unknown'
            let osName = 'Unknown'

            if (ua.indexOf('Firefox') > -1) browserName = 'Firefox'
            else if (ua.indexOf('SamsungBrowser') > -1)
                browserName = 'Samsung Internet'
            else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1)
                browserName = 'Opera'
            else if (ua.indexOf('Trident') > -1)
                browserName = 'Internet Explorer'
            else if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1)
                browserName = 'Edge'
            else if (ua.indexOf('Chrome') > -1) browserName = 'Chrome'
            else if (ua.indexOf('Safari') > -1) browserName = 'Safari'

            if (ua.indexOf('Android') > -1) osName = 'Android'
            else if (
                ua.indexOf('iPhone') > -1 ||
                ua.indexOf('iPad') > -1 ||
                ua.indexOf('iPod') > -1
            )
                osName = 'iOS'
            else if (ua.indexOf('Win') > -1) osName = 'Windows'
            else if (ua.indexOf('Mac') > -1) osName = 'macOS'
            else if (ua.indexOf('Linux') > -1) osName = 'Linux'

            setBrowser(browserName)
            setOs(osName)
            setLanguage(navigator.language)

            const concurrency = navigator.hardwareConcurrency
            const ram = (navigator as any).deviceMemory
            let hwInfo = 'Unknown'
            if (concurrency || ram) {
                hwInfo = `${concurrency ? concurrency + ' Cores' : ''}${concurrency && ram ? ' / ' : ''}${ram ? '~' + ram + 'GB RAM' : ''}`
            }
            setHardware(hwInfo)

            const conn = (navigator as any).connection
            if (conn) {
                setConnection(
                    `${conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Unknown'} ${conn.downlink ? `(${conn.downlink}Mbps)` : ''}`
                )
            }

            try {
                setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
            } catch {
                setTimezone('Unknown')
            }
        }
    }, [])

    const info = [
        { label: 'OS', value: os },
        { label: 'Host', value: 'Blog_Instance_01' },
        { label: 'Kernel', value: 'React 19.0.0' },
        { label: 'Uptime', value: uptime || 'Calculating...' },
        { label: 'Resolution', value: resolution || 'Unknown' },
        { label: 'Shell', value: browser },
        { label: 'Theme', value: 'Retro Terminal' },
        { label: 'CPU', value: 'Client Side Rendering' },
        { label: 'Lang', value: language },
        { label: 'H/W', value: hardware },
        { label: 'Net', value: connection },
        { label: 'Time', value: timezone },
    ]

    return (
        <div className="mb-6 flex flex-col items-center gap-6 text-xs sm:flex-row sm:items-start sm:text-sm">
            <pre className="text-primary hidden leading-tight font-bold opacity-80 select-none sm:block">
                {PC_ASCII}
            </pre>
            <div className="flex w-full flex-col gap-1">
                <div className="mb-2 flex gap-2">
                    <span className="text-secondary font-bold">guest@blog</span>
                    <span className="text-base-content/50">on</span>
                    <span className="text-secondary font-bold">~</span>
                </div>
                {info.map((item) => (
                    <div key={item.label} className="flex gap-2">
                        <span className="text-primary min-w-25 font-bold">
                            {item.label}:
                        </span>
                        <span className="text-base-content/80">
                            {item.value}
                        </span>
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

                <div className="text-base-content/40 mt-4 border-t border-dashed border-white/20 pt-2 text-[10px]">
                    <span className="text-warning mr-2">⚠</span>
                    <span>
                        PRIVACY_NOTICE: CLIENT_SIDE_ONLY. NO_DATA_COLLECTED.
                    </span>
                </div>
            </div>
        </div>
    )
}

export default function Notice({ className }: { className?: string }) {
    return (
        <div className={'w-full text-sm ' + (className || '')}>
            <div className="border-terminal relative">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-neutral/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_SYSTEM_ANNOUNCEMENT']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['NOTICE\_BOARD']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['PRIORITY']"></div>
                            <div className="text-warning animate-pulse text-xs opacity-70 before:content-['HIGH']"></div>
                        </div>
                    </div>

                    <div className="p-2 lg:p-4">
                        <Neofetch />

                        <div className="border-neutral/50 my-4 border-t border-dashed"></div>

                        <div className="relative">
                            <div className="text-base-content/50 mb-2 text-[10px] uppercase after:content-['Message\_Body']"></div>
                            <AriticleContene className="">
                                <NoticeModule />
                            </AriticleContene>
                        </div>
                    </div>

                    <div className="text-base-content mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_END_OF_NOTICE']"></span>
                        <span className="ml-1 animate-pulse before:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}

export const NoticeMenuItem = memo(MenuItem)
export const NoticeStore = useMenuItemStore
