export interface ArchiveItemInterface {
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
    achievementsUnlocked?: AchievementItemInterface[]
    specialAbilities?: SpecialAbiliteItem[]
    dnd5e?: DND5eItemInterface
    legalDisclaimer?: string[]
}

export interface ArchiveDataInterface {
    created_at: string
    updated_at: string | null
    data: ArchiveItemInterface
}

export interface AchievementItemInterface {
    name: string
    icon: string
    discription: string
}

export interface healthStatus {
    name: string
    discription: string
    value: string
}

export type HealthType = healthStatus[]

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

export interface DND5eItemInterface {
    alignment: string
    abilityScores: {
        STR: number
        DEX: number
        CON: number
        INT: number
        WIS: number
        CHA: number
    }
    savingThrows: Array<'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'>
    skills: string[]
    classLevels: string
    hitPoints: string
    armorClass: number
    spellcasting: string
}

export interface SpecialAbiliteItem {
    name: string
    level: string
    effect: string
    discription: string
}
