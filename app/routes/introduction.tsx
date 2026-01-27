import PageHead from '../components/about/pageHead'
import AriticleContene from '../components/aritcleContent'
import AboutIntroduction from '../contents/pages/About'

export default function Introduction() {
    return (
        <>
            <div className="flex min-h-screen min-w-full flex-col gap-4">
                <PageHead title="Introduction" />
                <AriticleContene>
                    <AboutIntroduction />
                </AriticleContene>
            </div>
        </>
    )
}
