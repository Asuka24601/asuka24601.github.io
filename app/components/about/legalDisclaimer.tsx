import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

export default function LegalDisclaimer({
    disclaimer,
    className,
}: {
    disclaimer: string[]
    className?: string
}) {
    if (!disclaimer || disclaimer.length === 0) return null
    const [title, ...clauses] = disclaimer

    return (
        <div className={`border-terminal ${className || ''}`}>
            <CRTOverlay className="opacity-0 transition-opacity duration-300 dark:opacity-100" />
            <TextJitter>
                <div className={`flex flex-col gap-2 text-red-400`}>
                    <div className="flex flex-col gap-2 border-b-2 border-dashed border-red-500/30 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_LEGAL\_PROTOCOL']"></div>
                            <div className="text-xs font-bold text-red-500 opacity-70">
                                WARNING: MANDATORY
                            </div>
                        </div>
                        <div className="text-sm font-bold tracking-wider whitespace-pre-wrap text-red-500 uppercase">
                            {title.replace(/^\*|\*$/g, '')}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-4 md:flex-row">
                        <div className="flex shrink-0 items-center justify-center border border-red-500/20 bg-red-900/5 p-1 select-none">
                            <pre className="text-[6px] leading-2.5 font-bold text-red-500">
                                {`⣇⣿⠘⣿⣿⣿⡿⡿⣟⣟⢟⢟⢝⠵⡝⣿⡿⢂⣼⣿⣷⣌⠩⡫⡻⣝⠹⢿⣿⣷
⡆⣿⣆⠱⣝⡵⣝⢅⠙⣿⢕⢕⢕⢕⢝⣥⢒⠅⣿⣿⣿⡿⣳⣌⠪⡪⣡⢑⢝⣇
⡆⣿⣿⣦⠹⣳⣳⣕⢅⠈⢗⢕⢕⢕⢕⢕⢈⢆⠟⠋⠉⠁⠉⠉⠁⠈⠼⢐⢕⢽
⡗⢰⣶⣶⣦⣝⢝⢕⢕⠅⡆⢕⢕⢕⢕⢕⣴⠏⣠⡶⠛⡉⡉⡛⢶⣦⡀⠐⣕⢕
⡝⡄⢻⢟⣿⣿⣷⣕⣕⣅⣿⣔⣕⣵⣵⣿⣿⢠⣿⢠⣮⡈⣌⠨⠅⠹⣷⡀⢱⢕
⡝⡵⠟⠈⢀⣀⣀⡀⠉⢿⣿⣿⣿⣿⣿⣿⣿⣼⣿⢈⡋⠴⢿⡟⣡⡇⣿⡇⡀⢕
⡝⠁⣠⣾⠟⡉⡉⡉⠻⣦⣻⣿⣿⣿⣿⣿⣿⣿⣿⣧⠸⣿⣦⣥⣿⡇⡿⣰⢗⢄
⠁⢰⣿⡏⣴⣌⠈⣌⠡⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣬⣉⣉⣁⣄⢖⢕⢕⢕
⡀⢻⣿⡇⢙⠁⠴⢿⡟⣡⡆⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣵⣵⣿
⡻⣄⣻⣿⣌⠘⢿⣷⣥⣿⠇⣿⣿⣿⣿⣿⣿⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣷⢄⠻⣿⣟⠿⠦⠍⠉⣡⣾⣿⣿⣿⣿⣿⣿⢸⣿⣦⠙⣿⣿⣿⣿⣿⣿⣿⣿⠟
⡕⡑⣑⣈⣻⢗⢟⢞⢝⣻⣿⣿⣿⣿⣿⣿⣿⠸⣿⠿⠃⣿⣿⣿⣿⣿⣿⡿⠁⣠
⡝⡵⡈⢟⢕⢕⢕⢕⣵⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣿⣿⣿⣿⣿⠿⠋⣀⣈⠙
⡝⡵⡕⡀⠑⠳⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢉⡠⡲⡫⡪⡪⡣`}
                            </pre>
                        </div>

                        <div className="flex flex-1 flex-col justify-center gap-2">
                            {clauses.map((clause, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-2 text-xs opacity-80 transition-colors hover:text-red-300"
                                >
                                    <span className="opacity-50 select-none">{`>>`}</span>
                                    <span>{clause}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                        <div className="text-[10px] uppercase opacity-40">
                            AGREEMENT_STATUS:{' '}
                            <span className="animate-pulse text-red-500">
                                FORCED
                            </span>
                        </div>
                        <div className="animate-pulse text-[10px] opacity-30">
                            _
                        </div>
                    </div>
                </div>
            </TextJitter>
        </div>
    )
}
