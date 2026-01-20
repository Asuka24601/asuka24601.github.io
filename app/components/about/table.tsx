interface Item {
    name: string
    value: number
    color?: string
}

export default function Table2Col({
    items,
    t1,
    t2,
    className,
    style,
}: {
    t1: string
    t2: string
    items: Item[] | undefined
    className?: string
    style?: React.CSSProperties
}) {
    if (!items) return null
    return (
        <>
            <table
                className={`mt-2 table text-center ${className}`}
                style={style}
            >
                <thead className="text-base-100 bg-[color-mix(in_srgb,var(--color-primary),white)]/90">
                    <tr className="*:p-3">
                        <th>{t1}</th>
                        <th>{t2}</th>
                    </tr>
                </thead>
                <tbody className="bg-base-100 text-base-content">
                    {items?.map((item, index) => (
                        <tr key={index} className="even:bg-base-200 *:p-2">
                            <th
                                className={
                                    item.color
                                        ? 'flex flex-row items-center gap-2'
                                        : ''
                                }
                            >
                                {item.color ? (
                                    <>
                                        <div
                                            className="border-base-content/15 inline-block aspect-square h-4 w-auto rounded-full border"
                                            style={{
                                                background: `${item.color}`,
                                            }}
                                        ></div>
                                        {item.name}
                                    </>
                                ) : (
                                    item.name
                                )}
                            </th>
                            <td>
                                {item.color
                                    ? item.value.toFixed(1)
                                    : item.value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
