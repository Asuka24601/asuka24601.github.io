import { useLayoutEffect } from 'react'

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
            <div className="mx-auto min-h-screen max-w-6xl">
                <p>comments</p>
            </div>
        </>
    )
}
