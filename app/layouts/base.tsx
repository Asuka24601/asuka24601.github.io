import { Outlet } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
// import HeaderBanner from '../components/headBanner'

export default function BaseLayout() {
    // const siteName = "Asuka24601'Site"

    return (
        <>
            <header className="flex flex-row items-center justify-between">
                {/* <HeaderBanner siteName={siteName} /> */}
                <NavBar />
            </header>

            <main className="my-3 min-h-dvh">
                <Outlet />
            </main>

            <Footer />
        </>
    )
}
