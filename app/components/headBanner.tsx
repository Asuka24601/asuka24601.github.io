import '../styles/baseLayout.css'
import * as wallpaper from '../assets/wallpaper.webp'
import { useImageStore } from '../lib/store'

export default function HeaderBanner({
    className,
}: {
    className?: string | undefined
}) {
    const ImgUrl = useImageStore((state) => state.imageUrl)

    return (
        <div className={className + ' headBannerImg'}>
            <img
                src={ImgUrl ? ImgUrl : wallpaper.default}
                className="w-full object-cover"
            />
        </div>
    )
}
