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
    gender?: string
    birthday?: string
    death?: string
    location?: string
    sexualOrientation?: string
    politicalOrientation?: string
    pronouns?: string
    languages?: {
        name: string
        level: number
    }[]
    ancestor?: string
    marriage?: string
}

export interface ProfileDataInterface {
    creationDate: string
    lastUpdateDate?: string | undefined
    data: ProfileItemInterface
}

export type ProfileStatisticsInterface = {
    name: string
    value: number
    routePath: string
}[]
