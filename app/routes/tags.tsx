import { useLayoutEffect } from 'react'

export default function Tags() {
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
            <div className="mx-auto min-h-screen max-w-400">
                <p>tags</p>
            </div>
        </>
    )
}
