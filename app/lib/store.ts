import { create } from 'zustand'
import type { ProfileDataInterface } from '../interfaces/profile'

export interface ThemeStore {
    theme: 'light' | 'dark'
    setTheme: (usr: 'light' | 'dark') => void
}

export interface NavStore {
    navShow: boolean
    navHeight: number
    setNavShow: (usr: boolean) => void
    resetNavShow: () => void
    setNavHeight: (usr: number) => void
    resetNavHeight: () => void
}

export interface SearchStore {
    searchShow: boolean
    setSearchShow: (usr: boolean) => void
    resetSearchShow: () => void
}

export interface ProfileStore {
    profileData: ProfileDataInterface
    setProfileData: (usr: ProfileDataInterface) => void
}

export interface LightBoxStore {
    lightboxSrc: string | null
    isImageLoading: boolean
    setLightboxSrc: (usr: string | null) => void
    resetLightboxSrc: () => void
    setIsImageLoading: (usr: boolean) => void
    resetIsImageLoading: () => void
}

interface DiogramDataStore {
    value: number
    setValue: (value: number) => void
}

// 心电图收数据
export const useDiogramDataStore = create<DiogramDataStore>()((set) => ({
    value: 0,
    setValue: (value) => set({ value }),
}))

export const useNavStore = create<NavStore>()((set) => ({
    navShow: true,
    navHeight: 0,
    setNavHeight: (usr: number) => set({ navHeight: usr }),
    resetNavHeight: () => set({ navHeight: 0 }),
    setNavShow: (usr: boolean) => set({ navShow: usr }),
    resetNavShow: () => set({ navShow: true }),
}))

export const useSearchStore = create<SearchStore>()((set) => ({
    searchShow: false,
    setSearchShow: (usr: boolean) => set({ searchShow: usr }),
    resetSearchShow: () => set({ searchShow: false }),
}))

export const useProfileDataStore = create<ProfileStore>()((set) => ({
    profileData: {
        created_at: new Date().toISOString(),
        data: {
            name: '',
            discription: '',
            avatar: '',
            tags: [],
            socialMedia: [],
        },
    },
    setProfileData: (usr: ProfileDataInterface) => set({ profileData: usr }),
}))

export const useLightBoxStore = create<LightBoxStore>()((set) => ({
    lightboxSrc: '',
    isImageLoading: false,
    setIsImageLoading: (usr: boolean) => set({ isImageLoading: usr }),
    resetIsImageLoading: () => set({ isImageLoading: false }),
    setLightboxSrc: (usr: string | null) => set({ lightboxSrc: usr }),
    resetLightboxSrc: () => set({ lightboxSrc: '' }),
}))

export const useThemeStore = create<ThemeStore>()((set) => ({
    theme: 'light',
    setTheme: (usr: 'light' | 'dark') => set({ theme: usr }),
}))
