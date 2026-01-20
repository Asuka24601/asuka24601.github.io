/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
import type { LocationInterface } from '../../interfaces/profile'
import ProgressiveImage from '../progressiveImage'

export function LocationComponent({
    location,
    className,
}: {
    location: LocationInterface | undefined
    className?: string
}) {
    const [clicked, setClicked] = useState<boolean>(false)

    const handleClick = (flag: boolean = false) => {
        if (flag) setClicked(true)
        else setClicked(flag)
    }

    if (!location) return null
    return (
        <>
            <div
                className={
                    (clicked && 'hover-3d transform-3d ') +
                    (className ? ` ${className}` : '')
                }
                onClick={() => {
                    if (!clicked) return
                    handleClick()
                }}
            >
                <div>
                    <div className="mockup-code text-base-100/50 bg-base-content w-full">
                        <pre data-prefix="$" className="text-warning">
                            <code>echo "{location.physical.name}"</code>
                        </pre>

                        <pre data-prefix="$" className="text-warning">
                            <code>{`cat /root/location.txt`}</code>
                        </pre>
                        <pre data-prefix=">" className="text-success flex">
                            <p className="inline-block w-[calc(100%-64px)] text-wrap break-all">
                                <strong>{location.physical.value}</strong>
                            </p>
                        </pre>

                        {location.physical.mapLink && (
                            <>
                                <pre
                                    data-prefix=">"
                                    className="text-success flex"
                                >
                                    <div className="inline-flex w-[calc(100%-64px)] flex-wrap items-center">
                                        <div className="border-success inline-block w-full border border-dashed"></div>
                                    </div>
                                </pre>
                                <pre
                                    data-prefix=">"
                                    className="text-success flex"
                                >
                                    <button
                                        className="inline-block aspect-4/3 h-auto w-3/4 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (clicked) return
                                            handleClick(true)
                                        }}
                                    >
                                        <ProgressiveImage
                                            src={location.physical.mapLink}
                                            className="aspect-4/3"
                                            alt="map"
                                        />
                                    </button>
                                </pre>
                                <pre
                                    data-prefix=">"
                                    className="text-success flex"
                                >
                                    <div className="inline-flex w-[calc(100%-64px)] flex-wrap items-center">
                                        <div className="border-success inline-block w-full border border-dashed"></div>
                                    </div>
                                </pre>
                            </>
                        )}

                        <pre data-prefix=">">
                            <code>: {location.physical.discription}</code>
                        </pre>
                        <pre data-prefix=">"></pre>

                        <pre data-prefix="$" className="text-warning">
                            <code>echo "{location.ip.name}"</code>
                        </pre>
                        <pre data-prefix="$" className="text-warning">
                            <code>{`ip -o addr show lo | awk '{print $4}'`}</code>
                        </pre>
                        <pre data-prefix=">" className="text-success">
                            <code>
                                <strong>{location.ip.value}</strong>
                            </code>
                        </pre>
                        <pre data-prefix=">">
                            <code>: {location.ip.discription}</code>
                        </pre>
                        <pre data-prefix=">"></pre>
                        <pre data-prefix="$" className="text-warning">
                            <code>echo "{location.mac.name}"</code>
                        </pre>
                        <pre data-prefix="$" className="text-warning">
                            <code>{`ip -o link show lo | awk '{print $17}'`}</code>
                        </pre>
                        <pre data-prefix=">" className="text-success">
                            <code>
                                <strong>{location.mac.value}</strong>
                            </code>
                        </pre>
                        <pre data-prefix=">">
                            <code>: {location.mac.discription}</code>
                        </pre>
                    </div>
                </div>

                <div></div>
                <div></div>

                <div></div>

                <div></div>

                <div></div>

                <div></div>

                <div></div>

                <div></div>
            </div>
        </>
    )
}
