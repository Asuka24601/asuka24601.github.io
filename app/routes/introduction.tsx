import AriticleContene from '../components/aritcleContent'
import AboutIntroduction from '../contents/pages/About'

export default function Introduction() {
    return (
        <>
            <div className="text-base-content/50 w-full text-xs">
                <p className="before:content-['#Introduction']"></p>
                <div className="divider my-1"></div>
            </div>
            <AriticleContene>
                <AboutIntroduction />
            </AriticleContene>
        </>
    )
}
