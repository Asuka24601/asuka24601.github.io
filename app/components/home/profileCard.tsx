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

    const avatarOnClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const element = e.target
        if (element instanceof HTMLImageElement) {
            if (element.classList.contains('animate__flip')) return
            element.classList.add('animate__flip')
            setTimeout(() => {
                element.classList.remove('animate__flip')
            }, 1000)
        }
    }

    return (
        <div className={`w-full text-sm ${className || ''}`}>
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-neutral/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_IDENTITY_VERIFIED']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['ACCESS\_CARD']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['LEVEL']"></div>
                            <div className="text-warning text-xs opacity-70 before:content-['ADMIN_01']"></div>
                        </div>
                    </div>

                    {/* Identity Section */}
                    <div className="mb-4 flex gap-4">
                        <div className="shrink-0">
                            <div
                                className="border-neutral/30 bg-base-300/20 h-24 w-24 cursor-pointer overflow-hidden border border-dashed p-1"
                                onClick={avatarOnClick}
                            >
                                <Avatar
                                    src={author.avatar}
                                    className="animate__animated h-full w-full object-cover opacity-90"
                                />
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col justify-center gap-1">
                            <h1 className="text-secondary text-lg font-bold tracking-wider uppercase">
                                {author.name}
                            </h1>
                            <div className="text-base-content/50 text-[10px] uppercase before:content-['ROLE:_SYSTEM_OPERATOR']"></div>
                            <div className="border-neutral/30 text-base-content/70 border-l-2 pl-2 text-xs leading-tight italic">
                                {author.introduction}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="border-neutral/50 mb-4 grid grid-cols-3 gap-2 border-y border-dashed py-2">
                        {profileStatistics.map((item, index) => (
                            <div
                                key={index}
                                className="group flex cursor-pointer flex-col items-center p-1 transition-colors hover:bg-white/5"
                            >
                                <Link
                                    to={item.routePath}
                                    className="w-full text-center"
                                >
                                    <div className="text-base-content/40 mb-1 text-[10px] uppercase">
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
                        <div className="text-base-content/50 mb-2 text-[10px] font-bold uppercase before:content-['SKILL_MATRIX']"></div>
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
                                        <div className="text-base-content flex justify-between text-[10px] uppercase opacity-80">
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
                    <div className="border-neutral/50 border-t border-dashed pt-2">
                        <div className="text-base-content/50 mb-2 text-[10px] font-bold uppercase before:content-['COMM_LINKS']"></div>
                        <div className="flex justify-between px-4">
                            {author.socialMedia.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary text-base-content/60 transition-colors"
                                >
                                    <SvgIcon name={item.icon} size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="text-base-content mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_'] after:content-['LOGIN:_SUCCESSFUL']"></span>
                        <span className="ml-1 animate-pulse before:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}

export default memo(ProfileCard)
