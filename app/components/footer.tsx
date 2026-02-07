import snap from '../assets/snap.webp'
import snapDark from '../assets/snap_dark.webp'
import author from '../assets/author.svg'
import SvgIcon from './SvgIcon'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'

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
        <div className="bg-base-200 relative w-full text-sm">
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    <div className="relative z-20 flex flex-row flex-nowrap justify-between">
                        <div className="flex flex-1 flex-col items-center justify-between gap-6 p-6 lg:flex-row lg:p-10">
                            <aside className="flex items-center gap-4">
                                <div className="border-neutral/30 bg-base-300/20 aspect-square h-16 w-auto border border-dashed p-1">
                                    <div className="h-full w-full bg-black">
                                        <img
                                            src={author}
                                            className="mx-auto h-full w-auto opacity-80 select-none"
                                            alt="author"
                                            draggable="false"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-primary text-lg font-bold tracking-widest uppercase">
                                        {name}
                                    </p>
                                    <p className="text-base-content/50 text-xs before:content-['>>_']">
                                        {discription}
                                    </p>
                                </div>
                            </aside>
                            <nav className="w-fit">
                                <h6 className="text-base-content/30 mb-2 text-center text-[10px] font-bold tracking-widest uppercase before:content-['COMM_UPLINKS']"></h6>
                                <div>
                                    <ul className="grid grid-flow-col gap-4">
                                        {socialMedia.map((item, index) => (
                                            <li key={index}>
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-primary text-base-content/60 transition-colors"
                                                >
                                                    <SvgIcon
                                                        name={item.icon}
                                                        size={20}
                                                    />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </nav>
                        </div>

                        <div className="border-neutral/30 relative hidden aspect-video h-48 w-auto overflow-hidden border-l-2 border-dashed select-none lg:block [&>img]:transition-opacity [&>img]:duration-300">
                            {/* <div className="bg-primary/10 pointer-events-none absolute inset-0 z-10 mix-blend-overlay"></div> */}
                            <img
                                src={snap}
                                alt="snap"
                                className="absolute z-1 h-full object-cover opacity-60 grayscale transition-all duration-500 hover:grayscale-0 dark:z-0 dark:opacity-0"
                                draggable="false"
                            />
                            <img
                                src={snapDark}
                                alt="snap"
                                className="absolute z-0 h-full object-cover opacity-0 grayscale transition-all duration-500 hover:grayscale-0 dark:z-1 dark:opacity-60"
                                draggable="false"
                            />
                        </div>
                    </div>

                    {/* System Status Bar */}
                    <div className="border-neutral/30 text-base-content/40 bg-base-100/40 flex justify-between border-t border-dashed px-4 py-1 text-[10px] tracking-widest uppercase">
                        <span className="after:content-['SYSTEM\_STATUS:_STABLE']"></span>
                        <span className="animate-pulse after:content-['>>_CONNECTED']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
