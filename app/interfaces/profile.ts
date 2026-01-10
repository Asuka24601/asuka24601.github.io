export interface ProfileItemInterface {
    name: string
    discription: string
    avater: string
    info: {
        name: string
        value: number
        routePath: string
    }[]
    tags: { name: string; icon: string; level: number }[]
    socialMedia: {
        icon: string
        link: string
    }[]
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
