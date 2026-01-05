/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react'
import '../styles/baseLayout.css'

const CloneOnHover = ({
    children,
    className = '',
}: {
    children: any
    className?: string | undefined
}) => {
    const [showClone, setShowClone] = useState(false)
    const [cloneStyle, setCloneStyle] = useState<React.CSSProperties>({})
    const originalRef = useRef<HTMLDivElement | null>(null)

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!originalRef.current) return

        const originalRect = originalRef.current.getBoundingClientRect()

        setCloneStyle({
            position: 'absolute',
            top: originalRect.top + window.scrollY,
            left: originalRect.left + window.scrollX,
            zIndex: 9999,
            pointerEvents: 'none',
        })

        setShowClone(true)
    }

    const handleMouseLeave = () => {
        setShowClone(false)
    }

    return (
        <>
            <div
                ref={originalRef}
                className={`hover-original ${className}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative' }}
            >
                {children}
            </div>

            {showClone && (
                <div className={`hover-clone ${className}`} style={cloneStyle}>
                    {children}
                </div>
            )}
        </>
    )
}

export default CloneOnHover
