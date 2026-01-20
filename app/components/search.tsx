import { useSearchStore } from '../lib/store'

export default function Search() {
    const searchShow = useSearchStore((state) => state.searchShow)
    const resetSearch = useSearchStore((state) => state.resetSearchShow)

    const onSearchClick = () => {
        console.log(searchShow)
        if (!searchShow) return
        resetSearch()
    }

    return (
        <>
            <dialog className="fixed top-0 left-0 z-50 block h-dvh w-dvw bg-black/50">
                <div
                    onClick={() => {
                        onSearchClick()
                    }}
                    className="h-full w-full"
                >
                    <form
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        className="bg-base-100 top-1/2 m-auto flex h-82.5 w-150 translate-y-1/2 flex-col items-center justify-center gap-4"
                    >
                        <input className="input"></input>
                        <button className="btn">sreach</button>
                    </form>
                </div>
            </dialog>
        </>
    )
}
