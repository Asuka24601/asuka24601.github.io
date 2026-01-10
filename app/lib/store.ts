import { create } from 'zustand'

export interface ImageStore {
    imageUrl: string
    setImageUrl: (usr: string) => void
    resetImage: () => void
}

// 定义一个 Store
export const useImageStore = create<ImageStore>()((set) => ({
    // 初始状态：图片 URL 为空
    imageUrl: '',

    // 更新状态的方法
    setImageUrl: (url: string) => set({ imageUrl: url }),

    // 可选：重置方法
    resetImage: () => set({ imageUrl: '' }),
}))
