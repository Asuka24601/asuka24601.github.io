import AriticleContene from '../components/aritcleContent'
import CRTOverlay from '../components/effect/CRTOverlay'
import AboutIntroduction from '../contents/pages/About'

export default function Introduction() {
    return (
        <>
            <div className="min-w-full">
                {/* <PageHead title="Introduction" /> */}

                <CRTOverlay />
                <div className="mb-8 flex items-end justify-between border-b border-dashed border-white/20 pb-4">
                    <div>
                        <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_SYSTEM_INTRODUCTION']"></div>
                        <h2 className="text-primary text-xl font-black tracking-widest uppercase before:content-['README.MD']"></h2>
                    </div>
                    <div className="text-right">
                        <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['PRIORITY']"></div>
                        <div className="text-success animate-pulse text-xs opacity-70 before:content-['LOW']"></div>
                    </div>
                </div>

                <div className="relative">
                    <AriticleContene className="font-mono">
                        <AboutIntroduction />
                    </AriticleContene>
                </div>

                <div className="text-base-content mt-8 text-[10px] opacity-50">
                    <span className="uppercase before:content-['>>_END_OF_FILE']"></span>
                    <span className="ml-1 animate-pulse before:content-['\_']"></span>
                </div>
            </div>
        </>
    )
}
