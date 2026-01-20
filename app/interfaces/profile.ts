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
    location?: LocationInterface
    sexualOrientation?: string
    politicalOrientation?: string
    pronouns?: string
    languages?: {
        name: string
        value: number
    }[]
    ancestor?: string
    marriage?: string
    species?: string
    bloodType?: string
    physicalForm?: string
    health?: HealthType
    materials?: {
        name: string
        value: number
        color: string
    }[]
    allergen?: string
    religion?: string
    race?: string
    halflife?: {
        discription: string
        formula: string
    }
    md5?: string
    sha256?: string
    sha512?: string
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

export interface healthStatus {
    name: string
    discription: string
    value: string
}

export type HealthType = [
    healthStatus,
    healthStatus,
    healthStatus,
    healthStatus,
    healthStatus,
    healthStatus,
    healthStatus,
]

export interface LocationInterface {
    physical: {
        name: string
        value: string
        discription: string
        mapLink?: string
    }
    ip: {
        name: string
        value: string
        discription: string
    }
    mac: {
        name: string
        value: string
        discription: string
    }
}
