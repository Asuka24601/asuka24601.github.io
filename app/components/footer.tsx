import * as localIcons from './icons'
import snap from '../assets/snap.webp'
import author from '../assets/author.svg'
import side from '../assets/side.webp'

type socialMediaType = {
    name: string
    link: string
    icon: string
}[]

export default function Footer({
    name,
    discription,
    socialMedia,
}: {
    name: string
    discription: string
    socialMedia: socialMediaType
}) {
    return (
        <>
            <div className="w-1/6 select-none">
                <img src={side} alt="side" draggable="false" />
            </div>
            <div className="bg-neutral text-neutral-content flex flex-row flex-nowrap justify-between">
                <div className="flex flex-1 flex-row flex-nowrap items-center justify-between p-10">
                    <aside>
                        <img
                            src={author}
                            className="select-none"
                            alt="author"
                            draggable="false"
                        />
                        <div>
                            <p className="text-neutral-content font-semibold opacity-80 first-letter:uppercase">
                                {name}
                            </p>
                            <p className="text-sm font-light opacity-50">
                                {discription}
                            </p>
                        </div>
                    </aside>
                    <nav className="w-fit">
                        <h6 className="footer-title">Social</h6>
                        <div>
                            <ul className="grid grid-flow-col gap-4">
                                {socialMedia.map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {localIcons[
                                                item.icon as keyof typeof localIcons
                                            ]?.({})}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className="aspect-auto h-72 w-auto overflow-hidden select-none">
                    <img
                        src={snap}
                        alt="sanp"
                        className="h-full object-cover"
                        draggable="false"
                    />
                </div>
            </div>
        </>
    )
}
