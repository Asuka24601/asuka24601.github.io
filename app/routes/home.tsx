import ProfileCard from '../components/profileCard'

export default function Home() {
    return (
        <div className="flex flex-row gap-3">
            <ProfileCard className="flex-1" />
            <section className="flex-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem
                velit illo veritatis labore exercitationem illum eum distinctio
                molestiae eveniet modi repellendus recusandae, dolorem, non
                iste. Voluptatibus alias eligendi asperiores provident.
            </section>
        </div>
    )
}
