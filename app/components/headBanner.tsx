import '../styles/baseLayout.css'

export default function HeaderBanner({
    className,
    src,
}: {
    className?: string | undefined
    src: string
}) {
    return (
        <div className={className + ' headBannerImg'}>
            <img src={src} className="object-cover" />
        </div>
    )
}
