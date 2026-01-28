import SvgIcon from '../SvgIcon'
import { Link } from 'react-router'
import type {
    ProfileDataInterface,
    ProfileStatisticsInterface,
} from '../../interfaces/profile'
import { memo } from 'react'
import Avatar from '../avater'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

function ProfileCard({
    className,
    profileData,
    profileStatistics,
}: {
    className?: string | undefined
    profileData: ProfileDataInterface
    profileStatistics: ProfileStatisticsInterface
}) {
    const author = profileData.data

    return (
        <div className={`w-full font-mono text-sm ${className || ''}`}>
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-primary/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_IDENTITY_VERIFIED']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['ACCESS_CARD']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['LEVEL']"></div>
                            <div className="text-warning text-xs opacity-70 before:content-['ADMIN_01']"></div>
                        </div>
                    </div>

                    {/* Identity Section */}
                    <div className="mb-4 flex gap-4">
                        <div className="shrink-0">
                            <div className="border-primary/30 h-24 w-24 border bg-black/20 p-1">
                                <Avatar
                                    src={author.avatar}
                                    className="h-full w-full object-cover opacity-90"
                                />
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col justify-center gap-1">
                            <h1 className="text-secondary text-lg font-bold tracking-wider uppercase">
                                {author.name}
                            </h1>
                            <div className="text-[10px] text-white/50 uppercase before:content-['ROLE:_SYSTEM_OPERATOR']"></div>
                            <div className="border-primary/30 border-l-2 pl-2 text-xs leading-tight text-white/70 italic">
                                {author.introduction}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-4 grid grid-cols-3 gap-2 border-y border-dashed border-white/10 py-2">
                        {profileStatistics.map((item, index) => (
                            <div
                                key={index}
                                className="group flex cursor-pointer flex-col items-center p-1 transition-colors hover:bg-white/5"
                            >
                                <Link
                                    to={item.routePath}
                                    className="w-full text-center"
                                >
                                    <div className="mb-1 text-[10px] text-white/40 uppercase">
                                        {item.name}
                                    </div>
                                    <div className="text-warning text-lg font-bold">
                                        {item.value}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Skills / Tags */}
                    <div className="mb-4">
                        <div className="mb-2 text-[10px] font-bold text-white/50 uppercase before:content-['SKILL_MATRIX']"></div>
                        <div className="grid grid-cols-2 gap-2">
                            {author.tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-xs"
                                >
                                    <SvgIcon
                                        name={tag.icon}
                                        size={14}
                                        className="text-primary/70"
                                    />
                                    <div className="flex flex-1 flex-col gap-0.5">
                                        <div className="flex justify-between text-[10px] uppercase opacity-80">
                                            <span>{tag.name}</span>
                                            <span>{tag.level}/3</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/10">
                                            <div
                                                className="bg-primary/60 h-full"
                                                style={{
                                                    width: `${(tag.level / 3) * 100}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer / Social */}
                    <div className="border-t border-dashed border-white/10 pt-2">
                        <div className="mb-2 text-[10px] font-bold text-white/50 uppercase before:content-['COMM_LINKS']"></div>
                        <div className="flex justify-between px-4">
                            {author.socialMedia.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary text-white/60 transition-colors"
                                >
                                    <SvgIcon name={item.icon} size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="text-base-100 mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_'] after:content-['LOGIN:_SUCCESSFUL']"></span>
                        <span className="ml-1 animate-pulse before:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}

export default memo(ProfileCard)
