export default function ProfileCard({
    className,
}: {
    className: string | undefined
}) {
    const author = {
        name: 'asuka24601',
        tags: ['CHS', 'ENG', 'React', 'TypeScript', 'Nodejs', 'CPP', 'Python'],
        discription: 'Hello World!',
    }

    return (
        <aside className={className}>
            <div className="card items-center p-2 shadow-sm">
                <div className="avatar">
                    <div className="rounde w-24">
                        <img src="avater.jpg" />
                    </div>
                </div>
                <h1 className="card-title">{author.name}</h1>
                <q>{author.discription}</q>
                <ul className="flex flex-row flex-wrap justify-evenly gap-1">
                    {author.tags.map((tag) => (
                        <li key={tag} className="badge badge-outline">
                            <span>{tag}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
