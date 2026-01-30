import type { AchievementItemInterface } from '../../interfaces/archive'

export default function AchievementList({
    items,
}: {
    items: AchievementItemInterface[]
    className?: string
}) {
    if (!items || items.length === 0) return null

    return (
        <div className="flex flex-col gap-4">
            <div className="border-primary/30 flex items-end justify-between border-b-2 border-dashed pb-2">
                <div>
                    <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_USER\_MILESTONES']"></div>
                    <div className="text-warning text-xl font-black tracking-widest uppercase before:content-['ACHIEVEMENTS']"></div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['TOTAL\_COUNT']"></div>
                    <div className="text-warning text-xs opacity-70 after:content-['_UNLOCKED']">
                        {items.length}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="border-base-content/10 group bg-modalBox/50 hover:bg-modalBox/80 flex items-start gap-3 border p-3 transition-colors"
                    >
                        <div className="border-warning/20 bg-base-300 flex h-10 w-10 shrink-0 items-center justify-center border select-none">
                            {item.icon}
                        </div>
                        <div className="flex flex-col gap-1 overflow-hidden">
                            <div className="text-warning truncate text-xs font-bold tracking-wider uppercase">
                                {item.name}
                            </div>
                            <div className="text-[10px] leading-tight opacity-70">
                                {item.discription}
                            </div>
                            <div className="mt-1 font-mono text-[8px] opacity-40 before:content-['ID\_REF:_']">
                                {index.toString().padStart(4, '0')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-1">
                <span className="text-[10px] text-white uppercase opacity-50 before:content-['>>_SYNC\_COMPLETE']"></span>
                <span className="text-warning ml-1 animate-pulse after:content-['\_']"></span>
            </div>
        </div>
    )
}
