import SvgIcon from '../SvgIcon'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

export default function DataItem({
    name,
    icon,
    children,
    className = '',
    style,
    question,
}: {
    name: string
    icon?: string
    className?: string
    children: React.ReactNode
    style?: React.CSSProperties
    question?: string
}) {
    return (
        <div className={`${className} w-full font-mono text-sm`} style={style}>
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    <div className="border-primary/30 flex flex-row flex-nowrap items-center justify-between gap-2 border-b border-dashed pb-2">
                        <div className="text-warning flex items-center gap-2">
                            <span className="opacity-70 select-none">{`>`}</span>
                            <div className="font-bold tracking-widest uppercase">
                                {name}
                            </div>

                            <SvgIcon
                                name={icon ? icon : name}
                                className="opacity-70"
                                size={14}
                            />
                        </div>
                        {question && (
                            <p className="max-w-37.5 truncate text-[10px] opacity-40 lg:max-w-xs">
                                // {question}
                            </p>
                        )}
                    </div>

                    <div className="contents">{children}</div>
                    <div className="flex justify-end">
                        <span className="animate-pulse text-[10px] opacity-30">
                            _
                        </span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
