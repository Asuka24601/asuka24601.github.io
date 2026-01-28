import AriticleContene from '../components/aritcleContent'
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'
import AboutIntroduction from '../contents/pages/About'

export default function Introduction() {
    return (
        <>
            <div className="flex min-w-full flex-col gap-4">
                {/* <PageHead title="Introduction" /> */}

                <div className="border-terminal">
                    <CRTOverlay />
                    <TextJitter>
                        <div className="border-primary/30 flex items-end justify-between border-b-2 border-dashed pb-2">
                            <div>
                                <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_SYSTEM_INTRODUCTION']"></div>
                                <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['SYSTEM_SELF-CHECK']"></div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['PRIORITY']"></div>
                                <div className="text-success animate-pulse text-xs opacity-70 before:content-['LOW']"></div>
                            </div>
                        </div>

                        <div className="p-2 md:p-4">
                            <div className="relative">
                                <AriticleContene className="font-mono">
                                    <AboutIntroduction />
                                </AriticleContene>
                            </div>
                        </div>

                        <div className="text-base-100 mt-4 text-[10px] opacity-50">
                            <span className="uppercase before:content-['>>_END_OF_NOTICE']"></span>
                            <span className="ml-1 animate-pulse before:content-['\_']"></span>
                        </div>
                    </TextJitter>
                </div>
            </div>
        </>
    )
}
