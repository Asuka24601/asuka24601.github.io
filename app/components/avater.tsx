import ProgressiveImage from './progressiveImage'
import localAvatar from '../assets/avatar.webp'
import CRTScreen from './effect/CRTScreen'

export default function Avatar({
    src,
    className,
    alt,
}: {
    src: string | undefined
    className?: string | undefined
    alt?: string | undefined
}) {
    return (
        <>
            {src ? (
                <ProgressiveImage
                    src={src}
                    placeholderSrc={localAvatar}
                    className={className || ''}
                    alt={alt || 'avatar'}
                    draggable={false}
                />
            ) : (
                <img
                    src={localAvatar}
                    className={className || ''}
                    alt={alt || 'avatar'}
                    draggable={false}
                />
            )}
            <CRTScreen />
        </>
    )
}
