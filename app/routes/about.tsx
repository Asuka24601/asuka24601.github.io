import { useLayoutEffect } from 'react'
import { useImageStore } from '../lib/store'

export default function About() {
    // const setImageUrl = useImageStore((state) => state.setImageUrl)
    const resetImage = useImageStore((state) => state.resetImage)
    const handleImgAction = () => {
        resetImage()
    }

    useLayoutEffect(() => {
        handleImgAction()
    }, [])

    return <p>about</p>
}
