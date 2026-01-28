import snap from '../assets/snap.webp'
import author from '../assets/author.svg'
import side from '../assets/side.webp'
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
        <div className="relative mt-20 w-full font-mono text-sm">
            <div className="pointer-events-none absolute top-0 left-0 z-10 h-48 w-80 -translate-y-full select-none">
                <img
                    src={side}
                    alt="side"
                    draggable="false"
                    className="absolute bottom-0 opacity-80"
                />
            </div>
            <div className="border-primary bg-modalBlack relative overflow-hidden border-t-4 border-double shadow-[0_-4px_0px_0px_rgba(0,0,0,0.3)]">
                <CRTOverlay />
                <TextJitter>
                    <div className="relative z-20 flex flex-row flex-nowrap justify-between">
                        <div className="flex flex-1 flex-col items-center justify-between gap-6 p-6 md:flex-row md:p-10">
                            <aside className="flex items-center gap-4">
                                <div className="border-primary/30 border bg-black/20 p-1">
                                    <img
                                        src={author}
                                        className="h-12 w-auto opacity-80 select-none"
                                        alt="author"
                                        draggable="false"
                                    />
                                </div>
                                <div>
                                    <p className="text-primary text-lg font-bold tracking-widest uppercase">
                                        {name}
                                    </p>
                                    <p className="text-xs text-white/50 before:content-['>>_']">
                                        {discription}
                                    </p>
                                </div>
                            </aside>
                            <nav className="w-fit">
                                <h6 className="mb-2 text-[10px] font-bold tracking-widest text-white/30 uppercase before:content-['COMM_UPLINKS']"></h6>
                                <div>
                                    <ul className="grid grid-flow-col gap-4">
                                        {socialMedia.map((item, index) => (
                                            <li key={index}>
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-primary text-white/60 transition-colors"
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

                        <div className="border-primary/30 relative hidden h-48 w-auto overflow-hidden border-l-2 border-dashed select-none md:block">
                            <div className="bg-primary/10 pointer-events-none absolute inset-0 z-10 mix-blend-overlay"></div>
                            <img
                                src={snap}
                                alt="snap"
                                className="h-full object-cover opacity-60 grayscale transition-all duration-500 hover:grayscale-0"
                                draggable="false"
                            />
                        </div>
                    </div>

                    {/* System Status Bar */}
                    <div className="border-primary/30 flex justify-between border-t border-dashed bg-black/40 px-4 py-1 text-[10px] tracking-widest text-white/40 uppercase">
                        <span>SYSTEM_STATUS: STABLE</span>
                        <span className="animate-pulse">_CONNECTED</span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
