import { useEffect, useRef, useState } from 'react'
import { useSearchStore } from '../lib/store'
import SvgIcon from './SvgIcon'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'

export default function Search() {
    const searchShow = useSearchStore((state) => state.searchShow)
    const resetSearch = useSearchStore((state) => state.resetSearchShow)
    const [query, setQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    // Close on Escape and focus input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') resetSearch()
        }
        if (searchShow) {
            const scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth
            document.body.style.overflow = 'hidden'
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`
            }

            window.addEventListener('keydown', handleKeyDown)
            setTimeout(() => inputRef.current?.focus(), 100)
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
        }
    }, [searchShow, resetSearch])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Searching for:', query)
        // Add search logic here
    }

    if (!searchShow) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 font-mono text-sm backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={resetSearch}></div>

            <div className="relative w-full max-w-2xl p-4">
                <div className="border-terminal">
                    {/* CRT Overlay */}
                    <CRTOverlay />

                    <TextJitter>
                        {/* Header */}
                        <div className="border-primary/30 flex items-end justify-between border-b-2 border-dashed pb-2">
                            <div>
                                <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_SYSTEM\_QUERY']"></div>
                                <div className="text-primary flex items-center gap-2">
                                    <SvgIcon name="search" size={24} />
                                    <div className="text-xl font-black tracking-widest uppercase before:content-['DATABASE\_SEARCH']"></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['STATUS']"></div>
                                <div className="text-primary animate-pulse text-xs opacity-70 before:content-['WAITING\_INPUT...']"></div>
                            </div>
                        </div>

                        {/* Input Form */}
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-2"
                        >
                            <label className="text-[10px] text-white/50 uppercase before:content-['Enter_Keywords:']"></label>
                            <div className="border-primary/50 flex items-center gap-3 border-b-2 bg-black/20 p-3">
                                <span className="text-primary font-bold before:content-['>']"></span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-white/20"
                                    placeholder="TYPE_HERE..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <span className="bg-primary h-5 w-2 animate-pulse"></span>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-[10px] text-white/40 before:content-['PRESS_[ESC]_TO_CANCEL']"></div>
                                <button className="group border-primary bg-primary/10 text-primary hover:bg-primary relative cursor-pointer overflow-hidden border px-6 py-2 transition-all hover:text-black">
                                    <span className="relative z-10 font-bold tracking-widest uppercase before:content-['[_EXECUTE_]']"></span>
                                </button>
                            </div>
                        </form>
                    </TextJitter>
                </div>
            </div>
        </div>
    )
}
