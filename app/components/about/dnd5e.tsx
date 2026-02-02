import type { DND5eItemInterface } from '../../interfaces/archive'

export default function DND5E({ item }: { item: DND5eItemInterface }) {
    const calculateModifier = (score: number) => Math.floor((score - 10) / 2)
    const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`)

    const abilities = [
        { key: 'STR', label: 'Strength' },
        { key: 'DEX', label: 'Dexterity' },
        { key: 'CON', label: 'Constitution' },
        { key: 'INT', label: 'Intelligence' },
        { key: 'WIS', label: 'Wisdom' },
        { key: 'CHA', label: 'Charisma' },
    ] as const

    return (
        <div className="flex flex-col gap-4">
            <div className="border-neutral/30 flex flex-col items-start justify-between gap-4 border-b-2 border-dashed pb-4 lg:flex-row lg:items-end">
                <div className="flex-1">
                    <div className="mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_CHARACTER\_SHEET\_V1.0']"></div>
                    <h2 className="text-primary text-2xl font-black tracking-tighter uppercase lg:text-3xl">
                        {item.classLevels}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 font-bold">
                        <span className="text-primary before:content-['>']"></span>
                        <span className="bg-base-content/10 px-2 py-0.5 text-xs uppercase">
                            {item.alignment}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="border-secondary bg-base-200 flex h-16 w-20 flex-col items-center justify-center border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                        <span className="text-secondary text-[10px] font-bold uppercase before:content-['ARMOR\_CLASS']"></span>
                        <span className="text-secondary text-2xl font-black">
                            {item.armorClass}
                        </span>
                    </div>
                    <div className="border-accent bg-base-200 flex h-16 w-20 flex-col items-center justify-center border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                        <span className="text-accent text-[10px] font-bold uppercase before:content-['HIT\_POINTS']"></span>
                        <span className="text-accent text-xl font-black">
                            {item.hitPoints}
                        </span>
                    </div>
                </div>
            </div>

            {/* Ability Scores Grid */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {abilities.map((ability) => {
                    const score = item.abilityScores[ability.key]
                    const mod = calculateModifier(score)
                    const isSave = item.savingThrows.includes(ability.key)

                    return (
                        <div
                            key={ability.key}
                            className={`group relative flex flex-col items-center border p-2 transition-all ${
                                isSave
                                    ? 'border-neutral bg-primary/5 hover:bg-primary/40'
                                    : 'border-base-content/20 bg-base-300/80 hover:bg-base-300'
                            }`}
                        >
                            {isSave && (
                                <div
                                    className="bg-primary absolute top-1 right-1 h-1.5 w-1.5"
                                    title="Saving Throw Proficiency"
                                ></div>
                            )}
                            <span className="mb-1 text-[10px] font-bold tracking-widest opacity-60">
                                {ability.key}
                            </span>
                            <span className="text-lg font-bold">
                                {formatModifier(mod)}
                            </span>
                            <div className="border-base-content/10 mt-1 border-t px-2 pt-1 text-xs opacity-70">
                                [{score}]
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Details Section */}
            <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Skills */}
                <div className="border-base-content/10 bg-base-300/80 border p-3">
                    <h3 className="text-primary mb-3 flex items-center gap-2 text-xs font-bold uppercase">
                        <span className="text-success before:content-['>>_SKILLS\_&\_PROFICIENCIES']"></span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="border-base-content/20 bg-base-100 text-base-content/80 border px-2 py-0.5 text-xs"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Spellcasting / Features */}
                <div className="border-base-content/10 bg-base-300/80 border p-3">
                    <h3 className="text-accent mb-3 flex items-center gap-2 text-xs font-bold uppercase">
                        <span className="text-accent before:content-['>>_NOTES\_LOG']"></span>
                    </h3>
                    <div className="text-xs leading-relaxed whitespace-pre-wrap opacity-80">
                        {item.spellcasting || 'No data found.'}
                        <span className="animate-blink before:content-['\_']"></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
