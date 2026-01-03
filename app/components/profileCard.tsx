import * as LocalIcons from '../components/icons'
import { Link } from 'react-router'

export default function ProfileCard({
    className,
}: {
    className?: string | undefined
}) {
    const author = {
        name: 'asuka24601',
        discription: 'Hello World!',
        info: [
            {
                name: '文章',
                value: 19,
                routePath: '/posts',
            },
            {
                name: '标签',
                value: 19,
                routePath: '/tags',
            },
            {
                name: '留言',
                value: 19,
                routePath: 'comments',
            },
        ],
        tags: [
            { name: 'React', icon: LocalIcons.MdiReact, level: 2 },
            { name: 'Vuejs', icon: LocalIcons.MdiVuejs, level: 2 },
            { name: 'Tailwind', icon: LocalIcons.MdiTailwind, level: 2 },
            {
                name: 'JavaScript',
                icon: LocalIcons.MdiLanguageJavascript,
                level: 2,
            },
            {
                name: 'TypeScript',
                icon: LocalIcons.MdiLanguageTypescript,
                level: 2,
            },
            { name: 'C', icon: LocalIcons.MdiLanguageC, level: 2 },
            { name: 'Cpp', icon: LocalIcons.MdiLanguageCpp, level: 2 },
            { name: 'Java', icon: LocalIcons.MdiLanguageJava, level: 1 },
            { name: 'Python', icon: LocalIcons.MdiLanguagePython, level: 1 },
            {
                name: 'Markdown',
                icon: LocalIcons.MdiLanguageMarkdown,
                level: 3,
            },
            { name: 'Rust', icon: LocalIcons.MdiLanguageRust, level: 1 },
            { name: 'CSharp', icon: LocalIcons.MdiLanguageCsharp, level: 1 },
            { name: 'ArchLinux', icon: LocalIcons.MdiArch, level: 2 },
            { name: 'Windows', icon: LocalIcons.MdiMicrosoftWindows, level: 2 },
            { name: 'Android', icon: LocalIcons.MdiAndroid, level: 2 },
            { name: 'Camera', icon: LocalIcons.MdiCamera, level: 2 },
            { name: 'Excel', icon: LocalIcons.MdiMicrosoftExcel, level: 1 },
            { name: 'Dog', icon: LocalIcons.MdiDog, level: 3 },
        ],
        socialMedia: [
            {
                icon: LocalIcons.StreamlineLogosGithubLogo2Solid,
                link: 'https://github.com/Asuka24601',
            },
            {
                icon: LocalIcons.StreamlineLogosBilibiliLogoSolid,
                link: 'https://space.bilibili.com/2724463',
            },
            {
                icon: LocalIcons.StreamlineLogosSteamLogoSolid,
                link: 'https://steamcommunity.com/id/1099734487',
            },
        ],
    }

    return (
        <div className={className}>
            <div className="card items-center gap-2">
                <div className="avatar">
                    <div className="w-24 rounded-full border border-white">
                        <img src="avater.jpg" />
                    </div>
                </div>
                <h1 className="card-title">{author.name}</h1>
                <q className="text-xs text-wrap text-gray-600">
                    {author.discription}
                </q>

                <ul className="flex w-full flex-row flex-nowrap justify-center gap-1 text-center">
                    {author.info.map((item, index) => (
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

                {/* <div className="divider my-0"></div> */}

                <ul className="flex w-full flex-row flex-wrap items-center justify-center gap-1 p-2">
                    {author.tags.map((tag, index) => (
                        <li key={index}>
                            <div
                                className="tooltip w-full"
                                data-tip={`${tag.name} : ${tag.level}/3`}
                            >
                                <tag.icon />

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
                                <item.icon />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
