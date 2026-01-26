/* eslint-disable @typescript-eslint/no-explicit-any */
import DataItem from '../components/about/dataItem'
import { PieChartSvgClassic } from '../components/chart/pieChart'
import HealthStatus from '../components/about/healthStatus'
import Table2Col from '../components/about/table'
import { LocationComponent } from '../components/about/location'
import Birthday from '../components/about/birthday'
import Latex from '../components/latex'
import archiveData from '../assets/data/archive.json'
import DND5E from '../components/about/dnd5e'
import AchievementList from '../components/about/achievementsUnlocked'
import SpecialAbilities from '../components/about/specialAbilities'
import LegalDisclaimer from '../components/about/legalDisclaimer'

const ABOUT_ITEMS_CONFIG = [
    { key: 'species', name: 'species', icon: 'dna', question: '你是什么物种?' },
    { key: 'race', name: 'race', icon: 'skull', question: '你是什么种族?' },
    { key: 'gender', name: 'gender', question: '你是GG还是MM?' },
    { key: 'death', name: 'death', question: '你什么时候死?' },
    {
        key: 'sexualOrientation',
        name: 'sexual orientation',
        icon: 'sexual',
        question: '你喜欢GG还是MM?',
    },
    {
        key: 'politicalOrientation',
        name: 'political orientation',
        icon: 'political',
        question: '你是左还是右?',
    },
    { key: 'religion', name: 'religion', question: '你信仰宗教吗?' },
    {
        key: 'pronouns',
        name: 'pronouns',
        icon: 'meh',
        question: '你希望别人怎么称呼你?',
    },
    {
        key: 'ancestor',
        name: 'ancestor',
        icon: 'human',
        question: '你的祖先是谁?',
    },
    {
        key: 'marriage',
        name: 'marriage',
        icon: 'wedding',
        question: '你结婚了吗?',
    },
    {
        key: 'physicalForm',
        name: 'physical form',
        icon: 'physic',
        question: '你是什么样子?',
    },
    {
        key: 'bloodType',
        name: 'blood type',
        icon: 'blood',
        question: '你是什么血型?',
    },
    {
        key: 'allergen',
        name: 'allergen',
        question: '你有对什么东西过敏吗?',
    },
]

export default function Archive() {
    return (
        <>
            <div className="text-base-content/50 w-full text-xs">
                <p className="before:content-['#Archive']"></p>
                <div className="divider my-1"></div>
            </div>

            <DataItem name="birthday" question="你多少岁了?">
                <Birthday
                    birthday={archiveData.data.birthday}
                    className="mt-2"
                />
            </DataItem>

            <DataItem
                name="special abilities"
                icon="cat"
                question="你有哪些特殊能力?"
            >
                <SpecialAbilities
                    items={archiveData.data.specialAbilities}
                    className="mt-2"
                />
            </DataItem>

            <DataItem
                name="achievements unlocked"
                icon="achievement"
                question="你获得过哪些成就?"
            >
                <AchievementList
                    items={archiveData.data.achievementsUnlocked}
                    className="mt-2"
                />
            </DataItem>

            {ABOUT_ITEMS_CONFIG.map((item) => (
                <DataItem
                    key={item.key}
                    name={item.name}
                    icon={item.icon}
                    question={item.question}
                >
                    <div>{(archiveData.data as any)[item.key]}</div>
                </DataItem>
            ))}

            <DataItem
                name="DND5E"
                icon="account"
                question="我能看看你的身份证吗?"
            >
                <DND5E item={archiveData.data.DND_5e as any} />
            </DataItem>

            <DataItem name="location" question="你来自哪里?">
                <LocationComponent
                    className="mt-3"
                    location={archiveData.data.location}
                />
            </DataItem>

            <DataItem name="health" question="你的健康状况怎么样?">
                <HealthStatus
                    status={archiveData.data.health}
                    className="mt-2"
                />
            </DataItem>

            <DataItem
                name="halflife"
                icon="physic"
                question="你的半衰期是多少?"
            >
                {
                    <div>
                        <Latex
                            formula={
                                archiveData.data.halflife?.formula as string
                            }
                            displayMode={true}
                        />
                        <p className="mx-auto block w-fit text-xs">
                            {archiveData.data.halflife?.discription}
                        </p>
                    </div>
                }
            </DataItem>

            <DataItem name="materials" question="你是由什么构成的?">
                <div className="flex w-full flex-row gap-8">
                    <PieChartSvgClassic
                        materials={archiveData.data.materials}
                        className="relative aspect-square h-auto flex-1/2"
                    />
                    <div className="flex aspect-square h-auto flex-1/2 flex-col content-start justify-center gap-3 rounded-2xl text-sm">
                        <Table2Col
                            t1="ingredient"
                            t2="proportion(%)"
                            items={archiveData.data.materials}
                        />
                    </div>
                </div>
            </DataItem>

            <DataItem name="languages" question="你使用哪些语言?">
                <Table2Col
                    t1="language"
                    t2="level(0~+∞)"
                    items={archiveData.data.languages}
                />
            </DataItem>

            <LegalDisclaimer disclaimer={archiveData.data.legalDisclaimer} />

            <div className="text-base-content/50 flex w-full flex-col gap-2 text-xs break-all">
                <div className="divider my-1"></div>
                <p className="before:mr-1 before:content-['MD5:']">
                    {archiveData.data.md5}
                </p>
                <p className="before:mr-1 before:content-['SHA256:']">
                    {archiveData.data.sha256}
                </p>
                <p className="before:mr-1 before:content-['SHA512:']">
                    {archiveData.data.sha512}
                </p>
            </div>
        </>
    )
}
