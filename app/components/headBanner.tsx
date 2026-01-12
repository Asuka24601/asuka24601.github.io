import '../styles/baseLayout.css'
import wallpaper from '../assets/wallpaper.webp'
import { useImageStore } from '../lib/store'

export default function HeaderBanner({
    className,
}: {
    className?: string | undefined
}) {
    const ImgUrl = useImageStore((state) => state.imageUrl)

    return (
        <div
            className={
                className +
                ' headBannerImg flex max-h-full w-full flex-col overflow-hidden'
            }
        >
            <img
                src={ImgUrl ? ImgUrl : wallpaper}
                className="w-full overflow-clip object-cover"
                alt="banner"
            />
        </div>
    )
}
