import { useLayoutEffect } from 'react'
import { useBannerStore, useProfileDataStore } from '../lib/store'

export default function About() {
    const resetImage = useBannerStore((state) => state.resetImage)
    const resetBannerRelative = useBannerStore(
        (state) => state.resetBannerRelative
    )
    const setBnanerShow = useBannerStore((state) => state.setBannerShow)
    const resetBannerShow = useBannerStore((state) => state.resetBannerShow)
    const setBannerRelative = useBannerStore((state) => state.setBannerRelative)

    const handleAction = () => {
        setBnanerShow(false)
        setBannerRelative(false)
    }

    useLayoutEffect(() => {
        handleAction()
        return () => {
            resetImage()
            resetBannerRelative()
            resetBannerShow()
        }
    })

    const ProfileData = useProfileDataStore((state) => state.profileData)

    return (
        <>
            <div>
                <div className="relative -top-18 h-118 w-full bg-black"></div>
                <article className="relative -top-43 mx-auto flex max-w-400 flex-col items-center justify-center">
                    <div className="avatar h-50 w-50">
                        <img
                            src={ProfileData.data.avatar}
                            alt="avatar"
                            draggable="false"
                            className="outline-base-content/15 rounded-full shadow-xs outline-1"
                        />
                    </div>
                    <h1 className="first-letter:uppercase">
                        <strong>{ProfileData.data.name}</strong>
                    </h1>
                    <section>
                        <p>{ProfileData.data.discription}</p>
                    </section>
                </article>
            </div>
        </>
    )
}
