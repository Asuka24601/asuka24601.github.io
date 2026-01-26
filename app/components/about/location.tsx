import type { LocationInterface } from '../../interfaces/archive'
import ProgressiveImage from '../progressiveImage'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

const CommandLine = ({ cmd }: { cmd: string }) => (
    <div className="text-warning flex gap-2 break-all">
        <span className="shrink-0 opacity-50 select-none">$</span>
        <span>{cmd}</span>
    </div>
)

const OutputLine = ({
    children,
    className = '',
}: {
    children: React.ReactNode
    className?: string
}) => (
    <div className={`text-success flex gap-2 break-all ${className}`}>
        <span className="shrink-0 opacity-50 select-none">{'>'}</span>
        <div className="flex-1">{children}</div>
    </div>
)

export function LocationComponent({
    location,
    className,
}: {
    location: LocationInterface | undefined
    className?: string
}) {
    if (!location) return null

    return (
        <div className={`w-full font-mono text-sm ${className || ''}`}>
            <div className="border-terminal">
                <CRTOverlay />

                <TextJitter className="gap-1 bg-[#232433]">
                    <CommandLine cmd={`echo "${location.physical.name}"`} />
                    <CommandLine cmd="cat /root/location.txt" />
                    <OutputLine>
                        <strong>{location.physical.value}</strong>
                    </OutputLine>

                    {location.physical.mapLink && (
                        <>
                            <OutputLine>
                                <div className="border-success/30 my-1 w-full border-t border-dashed"></div>
                            </OutputLine>
                            <OutputLine>
                                <button
                                    className="w-full max-w-xs text-left"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="border-success/50 hover:border-success relative border-2 p-1 transition-colors">
                                        <ProgressiveImage
                                            src={location.physical.mapLink}
                                            className="aspect-4/3 w-full grayscale transition-all duration-500 hover:grayscale-0"
                                            alt="map"
                                            useLightBox={true}
                                        />
                                        <div className="border-success absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2"></div>
                                        <div className="border-success absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2"></div>
                                        <div className="border-success absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2"></div>
                                        <div className="border-success absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2"></div>
                                    </div>
                                </button>
                            </OutputLine>
                            <OutputLine>
                                <div className="border-success/30 my-1 w-full border-t border-dashed"></div>
                            </OutputLine>
                        </>
                    )}

                    <OutputLine>
                        <span className="opacity-70">
                            # {location.physical.discription}
                        </span>
                    </OutputLine>
                    <div className="h-2"></div>

                    <CommandLine cmd={`echo "${location.ip.name}"`} />
                    <CommandLine cmd="ip -o addr show lo | awk '{print $4}'" />
                    <OutputLine>
                        <strong>{location.ip.value}</strong>
                    </OutputLine>
                    <OutputLine>
                        <span className="opacity-70">
                            # {location.ip.discription}
                        </span>
                    </OutputLine>
                    <div className="h-2"></div>

                    <CommandLine cmd={`echo "${location.mac.name}"`} />
                    <CommandLine cmd="ip -o link show lo | awk '{print $17}'" />
                    <OutputLine>
                        <strong>{location.mac.value}</strong>
                    </OutputLine>
                    <OutputLine>
                        <span className="opacity-70">
                            # {location.mac.discription}
                        </span>
                    </OutputLine>

                    <div className="mt-2">
                        <span className="text-warning animate-pulse">_</span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
