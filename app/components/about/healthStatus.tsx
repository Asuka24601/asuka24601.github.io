interface Status {
    name: string
    discription: string
    value: string
}

export default function HealthStatus({
    status,
}: {
    status: Status[] | undefined
}) {
    if (!status || status.length !== 7) return null

    return (
        <>
            <div className="flex flex-col">
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[0].name}</div>
                        <div className={`stat-value text-green-500`}>
                            {status[0].value}
                        </div>
                        <div className="stat-desc">{status[0].discription}</div>
                    </div>
                </div>
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[1].name}</div>
                        <div className={`stat-value`}>{status[1].value}</div>
                        <div className="stat-desc">{status[1].discription}</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[2].name}</div>
                        <div className={`stat-value`}>{status[2].value}</div>
                        <div className="stat-desc">{status[2].discription}</div>
                    </div>
                </div>
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[3].name}</div>
                        <div className={`stat-value`}>{status[3].value}</div>
                        <div className="stat-desc">{status[3].discription}</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[4].name}</div>
                        <div className={`stat-value`}>{status[4].value}</div>
                        <div className="stat-desc">{status[4].discription}</div>
                    </div>
                </div>
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[5].name}</div>
                        <div className={`stat-value text-red-500`}>
                            {status[5].value}
                        </div>
                        <div className="stat-desc">{status[5].discription}</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[6].name}</div>
                        <div className={`stat-value text-blue-500`}>
                            {status[6].value}
                        </div>
                        <div className="stat-desc">{status[6].discription}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
