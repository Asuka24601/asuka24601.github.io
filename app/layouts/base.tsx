import { Outlet } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import '../styles/baseLayout.css'
import { useEffect } from 'react'
import { useProfileDataStore, useSearchStore } from '../lib/store'
import Search from '../components/search'
import LightBox from '../components/lightBox'
import profileData from '../assets/data/author.json'
import ToUp from '../components/toUp'
import side from '../assets/side.webp'

export default function BaseLayout() {
    const siteName = `${profileData.data.name}'Site`

    const searchShow = useSearchStore((state) => state.searchShow)

    const setProfileData = useProfileDataStore((state) => state.setProfileData)

    useEffect(() => {
        setProfileData(profileData)
    }, [setProfileData])

    return (
        <>
            <header className="sticky top-0 z-2 h-0 w-full" id="header">
                <NavBar siteName={siteName} />
            </header>
            <main className="relative z-1">
                <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-80 select-none">
                    <img
                        src={side}
                        alt="side"
                        draggable="false"
                        className="absolute bottom-0 opacity-80"
                    />
                </div>
                <Outlet />
                <ToUp />
            </main>
            <footer className="relative z-1">
                <Footer
                    name={profileData.data.name}
                    discription={profileData.data.discription}
                    socialMedia={profileData.data.socialMedia}
                />
            </footer>
            {searchShow && <Search />}
            <LightBox />
        </>
    )
}
