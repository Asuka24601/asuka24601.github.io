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
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'

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
            <div className="flex min-h-screen min-w-full flex-col">
                <CRTOverlay />
                <div className="mb-8 border-b border-dashed border-white/20 pb-4">
                    <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_SYSTEM_BENCHMARK_CHECK']"></div>
                    <h2 className="text-primary text-xl font-black tracking-widest uppercase before:content-['OUTPUT.LOG']"></h2>
                </div>
                <div className="gap-x-4 *:mt-4 *:first:mt-0">
                    <DataItem name="birthday" question="你多少岁了?">
                        <Birthday birthday={archiveData.data.birthday} />
                    </DataItem>
                    <DataItem
                        name="special abilities"
                        icon="cat"
                        question="你有哪些特殊能力?"
                    >
                        <SpecialAbilities
                            items={archiveData.data.specialAbilities}
                        />
                    </DataItem>
                    <DataItem
                        name="achievements unlocked"
                        icon="achievement"
                        question="你获得过哪些成就?"
                    >
                        <AchievementList
                            items={archiveData.data.achievementsUnlocked}
                        />
                    </DataItem>
                    {ABOUT_ITEMS_CONFIG.map((item) => (
                        <DataItem
                            key={item.key}
                            name={item.name}
                            icon={item.icon}
                            question={item.question}
                        >
                            <div className="text-base-content flex flex-col gap-3">
                                {(archiveData.data as any)[item.key]}
                                <div className="mt-1">
                                    <span className="text-base-content text-[10px] uppercase opacity-50 before:content-['>>_SYSTEM\_DATABASE\_QUERY:_COMPLETED']"></span>
                                </div>
                            </div>
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
                            location={archiveData.data.location}
                        />
                    </DataItem>
                    <DataItem name="health" question="你的健康状况怎么样?">
                        <HealthStatus status={archiveData.data.health} />
                    </DataItem>
                    <DataItem
                        name="halflife"
                        icon="physic"
                        question="你的半衰期是多少?"
                    >
                        {
                            <div className="text-base-content">
                                <Latex
                                    formula={
                                        archiveData.data.halflife
                                            ?.formula as string
                                    }
                                    displayMode={true}
                                />
                                <p className="mx-auto block w-fit text-center text-xs">
                                    {archiveData.data.halflife?.discription}
                                </p>
                                <div className="mt-4">
                                    <span className="text-base-content text-[10px] uppercase opacity-50 before:content-['>>_SYSTEM\_DATABASE\_QUERY:_COMPLETED']"></span>
                                </div>
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
                                    className="text-base-content"
                                />
                            </div>
                        </div>
                    </DataItem>
                    <DataItem name="languages" question="你使用哪些语言?">
                        <Table2Col
                            t1="language"
                            t2="level(0~+∞)"
                            items={archiveData.data.languages}
                            className="text-base-content"
                        />
                    </DataItem>

                    <div className="w-full">
                        <LegalDisclaimer
                            disclaimer={archiveData.data.legalDisclaimer}
                        />
                    </div>

                    <div className="border-terminal flex w-full flex-col gap-2 text-xs break-all">
                        <CRTOverlay />
                        <TextJitter>
                            <strong className="text-success flex flex-col gap-2">
                                <p className="before:mr-1 before:content-['>>_MD5:']">
                                    {archiveData.data.md5}
                                </p>

                                <p className="before:mr-1 before:content-['>>_SHA256:']">
                                    {archiveData.data.sha256}
                                </p>
                                <p className="before:mr-1 before:content-['>>_SHA512:']">
                                    {archiveData.data.sha512}
                                </p>
                            </strong>
                        </TextJitter>
                    </div>
                </div>

                <div className="text-base-content mt-4 text-[10px] opacity-50">
                    <span className="uppercase before:content-['>>_END_OF_LOG']"></span>
                    <span className="ml-1 animate-pulse before:content-['\_']"></span>
                </div>
            </div>
        </>
    )
}
