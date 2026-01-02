import ProfileCard from '../components/profileCard'

export default function Home() {
    return (
        <>
            <section>
                <div className="flex h-full min-h-full flex-wrap gap-3">
                    <ProfileCard className="bg-base-100 w-52 rounded-md px-2 py-4 shadow-2xl" />
                    <section className="bg-base-100 flex-1 rounded-md p-3 shadow-2xl">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Autem velit illo veritatis labore exercitationem
                        illum eum distinctio molestiae eveniet modi repellendus
                        recusandae, dolorem, non iste. Voluptatibus alias
                        eligendi asperiores provident.
                    </section>
                    <section className="bg-base-100 w-full rounded-md p-3 shadow-2xl">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Odio dolorum esse ipsam vel pariatur explicabo
                        ducimus nostrum cupiditate dolores itaque eaque, impedit
                        asperiores veniam culpa corporis temporibus. Maxime,
                        dicta veniam.
                    </section>
                    <div className="flex w-full flex-wrap gap-1.5">
                        {(() => {
                            const x = []
                            for (let i = 0; i < 8; i++)
                                x.push(
                                    <div
                                        key={i}
                                        className="bg-base-100 flex-1/4 rounded-md p-3 shadow-xl"
                                    >
                                        {i}
                                    </div>
                                )
                            return x
                        })()}
                    </div>
                </div>
            </section>
        </>
    )
}
