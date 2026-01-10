/* eslint-disable react-refresh/only-export-components */
import { Outlet } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import '../styles/baseLayout.css'
import HeaderBanner from '../components/headBanner'
import type { ProfileDataInterface } from '../interfaces/profile'
import fetchData from '../lib/fetchData'
import type { Route } from './+types/base'

export async function clientLoader(): Promise<{
    profileData: ProfileDataInterface
}> {
    const profileFilePath = '/data/author.json'
    const loaderProfileData = await fetchData(profileFilePath, 'json')
    return {
        profileData: loaderProfileData,
    }
}

export default function BaseLayout({ loaderData }: Route.ComponentProps) {
    const { profileData } = loaderData
    const siteName = `${profileData.data.name}'Site`

    return (
        <>
            <main className="relative">
                <HeaderBanner className="absolute top-0 h-fit max-h-dvh w-full overflow-hidden" />

                <header className="sticky top-0 z-10 overflow-visible opacity-85">
                    <NavBar className="p-3" siteName={siteName} />
                </header>

                <section className="relative mx-auto min-h-dvh max-w-400 px-6 pt-3 pb-6">
                    <Outlet />
                </section>
            </main>

            <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content relative p-10">
                <Footer profileData={profileData} />
            </footer>
        </>
    )
}
