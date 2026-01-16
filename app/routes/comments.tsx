import { useLayoutEffect } from 'react'
import { useBannerStore } from '../lib/store'

export default function Comments() {
    const resetImage = useBannerStore((state) => state.resetImage)
    const resetBannerRelative = useBannerStore(
        (state) => state.resetBannerRelative
    )
    const setBannerRelative = useBannerStore((state) => state.setBannerRelative)

    const handleAction = () => {
        setBannerRelative(false)
    }

    useLayoutEffect(() => {
        handleAction()
        return () => {
            resetImage()
            resetBannerRelative()
        }
    })

    return (
        <>
            <div className="mx-auto max-w-400">
                <p>comments</p>
            </div>
        </>
    )
}
