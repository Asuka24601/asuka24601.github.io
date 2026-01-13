import { create } from 'zustand'

export interface ImageStore {
    imageUrl: string
    blurred: boolean
    setBlurred: (usr: boolean) => void
    resetBlurred: () => void
    setImageUrl: (usr: string) => void
    resetImage: () => void
}

export interface NavStore {
    navShow: boolean
    setNavShow: (usr: boolean) => void
    resetNav: () => void
}

// 定义一个 Store
export const useImageStore = create<ImageStore>()((set) => ({
    imageUrl: '',
    blurred: false,

    setImageUrl: (url: string) => set({ imageUrl: url }),
    resetImage: () => set({ imageUrl: '' }),

    setBlurred: (usr: boolean) => set({ blurred: usr }),
    resetBlurred: () => set({ blurred: false }),
}))

export const useNavStore = create<NavStore>()((set) => ({
    navShow: true,
    setNavShow: (usr: boolean) => set({ navShow: usr }),
    resetNav: () => set({ navShow: true }),
}))
