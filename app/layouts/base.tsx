import { Outlet } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import '../styles/baseLayout.css'
import HeaderBanner from '../components/headBanner'

export default function BaseLayout() {
    const siteName = "Asuka24601'Site"

    return (
        <>
            <main className="relative">
                <HeaderBanner className="absolute top-0 h-full max-h-max w-full overflow-hidden" />

                <header className="sticky top-0 z-10 overflow-visible">
                    <NavBar className="p-3" siteName={siteName} />
                </header>

                <section className="relative min-h-dvh px-6 py-3">
                    <Outlet />
                </section>
            </main>

            <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content relative p-10">
                <Footer />
            </footer>
        </>
    )
}
