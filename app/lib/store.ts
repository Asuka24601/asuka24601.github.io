import { create } from 'zustand'
import type { ProfileDataInterface } from '../interfaces/profile'

export interface NavStore {
    navShow: boolean
    setNavShow: (usr: boolean) => void
    resetNavShow: () => void
}

export interface SearchStore {
    searchShow: boolean
    setSearchShow: (usr: boolean) => void
    resetSearchShow: () => void
}

export interface BannersStore {
    bannerRelative: boolean
    bannerShow: boolean
    imageUrl: string
    blurred: boolean
    setBlurred: (usr: boolean) => void
    resetBlurred: () => void
    setImageUrl: (usr: string) => void
    resetImage: () => void
    setBannerRelative: (usr: boolean) => void
    resetBannerRelative: () => void
    setBannerShow: (usr: boolean) => void
    resetBannerShow: () => void
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

export const useNavStore = create<NavStore>()((set) => ({
    navShow: true,
    setNavShow: (usr: boolean) => set({ navShow: usr }),
    resetNavShow: () => set({ navShow: true }),
}))

export const useSearchStore = create<SearchStore>()((set) => ({
    searchShow: false,
    setSearchShow: (usr: boolean) => set({ searchShow: usr }),
    resetSearchShow: () => set({ searchShow: false }),
}))

export const useBannerStore = create<BannersStore>()((set) => ({
    bannerRelative: true,
    imageUrl: '',
    blurred: false,
    bannerShow: true,

    setBannerShow: (usr: boolean) => set({ bannerShow: usr }),
    resetBannerShow: () => set({ bannerShow: true }),
    setImageUrl: (url: string) => set({ imageUrl: url }),
    resetImage: () => set({ imageUrl: '' }),
    setBlurred: (usr: boolean) => set({ blurred: usr }),
    resetBlurred: () => set({ blurred: false }),
    setBannerRelative: (usr: boolean) => set({ bannerRelative: usr }),
    resetBannerRelative: () => set({ bannerRelative: true }),
}))

export const useProfileDataStore = create<ProfileStore>()((set) => ({
    profileData: {
        creationDate: new Date().toISOString(),
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

// TODO
