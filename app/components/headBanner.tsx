import '../styles/baseLayout.css'

export default function HeaderBanner({
    className,
}: {
    className: string | undefined
}) {
    return (
        <div className={className + ' headBannerImg'}>
            <img src="wallpaper.webp" className="object-cover" />
        </div>
    )
}
