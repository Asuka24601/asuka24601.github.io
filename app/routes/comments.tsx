import { useLayoutEffect } from 'react'
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'
import CommentsComponent from '../components/comments'

export default function Comments() {
    const handleAction = () => {
        window.scrollTo({
            top: 0,
            behavior: 'instant',
        })
    }

    useLayoutEffect(() => {
        handleAction()
        return () => {}
    }, [])

    return (
        <>
            <div className="mx-auto min-h-screen w-full">
                <div className="border-terminal mx-auto grid min-h-[inherit] max-w-6xl overflow-visible! border-none! p-4 lg:p-6">
                    <div className="min-h-full w-full transition-transform duration-500">
                        <CRTOverlay />
                        <TextJitter className="border-neutral! bg-base-200 relative min-h-full overflow-hidden border-4 border-double">
                            <CommentsComponent mapping={'pathname'} />
                        </TextJitter>
                    </div>
                </div>
            </div>
        </>
    )
}
