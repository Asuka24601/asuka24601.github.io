import type { PostListInterface } from '../../interfaces/post'
import { timeToString } from '../../lib/utils'
import SvgIcon from '../SvgIcon'
import { Link } from 'react-router'

export default function RecentComponent({
    className,
    recentData,
    count,
}: {
    className?: string | undefined
    recentData: PostListInterface
    count: number
}) {
    const recentPosts = recentData.posts
        .sort((b, a) => {
            const da = new Date(a.frontMatter.date).getTime()
            const db = new Date(b.frontMatter.date).getTime()
            return da - db
        })
        .slice(0, count)

    function timeMark(timeString: string) {
        const t = timeToString(timeString)
        return (
            <>
                <span className="text-xs text-gray-950 opacity-45">{`${t.date} - ${t.time}`}</span>
            </>
        )
    }

    return (
        <>
            <ul className={className + ' list'}>
                {recentPosts.map((item, index) => (
                    <li key={index} className="list-row px-0">
                        <div className="text-4xl font-thin tabular-nums opacity-30">
                            {index.toString().padStart(2, '0')}
                        </div>

                        <div className="list-col-grow relative">
                            <div className="text-sm text-zinc-800">
                                <Link to={`posts/${item.path}`}>
                                    <strong>{item.frontMatter.title}</strong>
                                </Link>
                            </div>
                            <div>{timeMark(item.frontMatter.date)}</div>
                            <div className="absolute top-0 right-0 scale-60">
                                <Link to={`posts/${item.path}`} target="_blank">
                                    <SvgIcon name="openNew" />
                                </Link>
                            </div>
                        </div>

                        <div className="list-col-wrap text-xs">
                            <q>{item.frontMatter.description}</q>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
