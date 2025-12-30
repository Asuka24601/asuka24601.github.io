import { Outlet } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'

export default function BaseLayout() {
    return (
        <>
            <header>
                <NavBar />
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <Footer />
            </footer>
        </>
    )
}
