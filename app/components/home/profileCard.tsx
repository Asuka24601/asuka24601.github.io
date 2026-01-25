import SvgIcon from '../SvgIcon'
import { Link } from 'react-router'
import ProgressiveImage from '../progressiveImage'
import type {
    ProfileDataInterface,
    ProfileStatisticsInterface,
} from '../../interfaces/profile'
import { memo } from 'react'

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
        <div className={className}>
            <div className="card h-full items-center justify-between gap-2">
                <div className="avatar">
                    <div className="w-24 rounded-full border border-white">
                        <ProgressiveImage src={author.avatar} />
                    </div>
                </div>
                <h1 className="card-title">{author.name}</h1>
                <q className="text-center text-xs text-wrap wrap-break-word text-gray-600">
                    {author.introduction}
                </q>

                <ul className="flex w-full flex-row flex-nowrap justify-center gap-1 text-center">
                    {profileStatistics.map((item, index) => (
                        <li key={index} className="badge h-full flex-1 py-1.5">
                            <div>
                                <h1 className="text-sm">{item.name}</h1>
                                <Link to={item.routePath}>
                                    <strong className="text-xs">
                                        {item.value}
                                    </strong>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>

                <ul className="flex w-full flex-row flex-wrap items-center justify-center gap-1 p-2">
                    {author.tags.map((tag, index) => (
                        <li key={index} className="w-min">
                            <div
                                className="tooltip w-full"
                                data-tip={`${tag.name} : ${tag.level}/3`}
                            >
                                <SvgIcon name={tag.icon} />

                                <progress
                                    className="progress"
                                    value={tag.level}
                                    max="3"
                                />
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="divider my-0"></div>

                <ul className="grid w-full grid-cols-3 justify-items-center">
                    {author.socialMedia.map((item, index) => (
                        <li key={index}>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <SvgIcon name={item.icon} />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default memo(ProfileCard)
