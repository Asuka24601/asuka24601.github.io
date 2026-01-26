export interface ProfileItemInterface {
    name: string
    discription: string
    avatar: string
    tags: { name: string; icon: string; level: number }[]
    socialMedia: {
        name: string
        icon: string
        link: string
    }[]
    introduction?: string
}

export interface ProfileDataInterface {
    created_at: string
    updated_at?: string | undefined
    data: ProfileItemInterface
}

export type ProfileStatisticsInterface = {
    name: string
    value: number
    routePath: string
}[]
