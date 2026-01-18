import SvgIcon from '../SvgIcon'

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
        <div
            className={`${className} flex w-full flex-col gap-1 overflow-hidden font-serif text-base text-wrap break-all whitespace-pre-wrap`}
            style={style}
        >
            <div className="flex flex-row flex-nowrap items-center gap-1">
                <div className="tooltip tooltip-right">
                    <div className="tooltip-content">
                        <div className="">{name}</div>
                    </div>
                    <SvgIcon name={icon ? icon : name} />
                </div>
                <p className="inline-block text-xs opacity-50">{question}</p>
            </div>

            {/* <div className="after:bg-base-content/25 my-3 after:block after:h-0.5 after:w-6"></div> */}

            <div>{children}</div>
        </div>
    )
}
