import wallpaper from '../assets/wallpaper.webp'
import { useImageStore } from '../lib/store'

export default function HeaderBanner({
    className,
}: {
    className?: string | undefined
}) {
    const ImgUrl = useImageStore((state) => state.imageUrl)
    const blurred = useImageStore((state) => state.blurred)

    return (
        <div
            className={
                className +
                ' headBannerImg flex max-h-full w-full flex-col overflow-hidden'
            }
        >
            <img
                src={ImgUrl ? ImgUrl : wallpaper}
                className="w-full overflow-clip object-cover select-none"
                alt="banner"
                draggable="false"
                style={{
                    ...(blurred
                        ? {
                              filter: `blur(calc(var(--scroll-percent, 0) * 50px)) brightness(75%)`,
                          }
                        : {
                              filter: `brightness(75%)`,
                          }),
                }}
            />
        </div>
    )
}
