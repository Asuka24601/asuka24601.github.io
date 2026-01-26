export default function CRTOverlay() {
    return (
        <div className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_3px,3px_100%]"></div>
            <div
                className="via-primary/10 absolute inset-x-0 top-0 h-full bg-linear-to-b from-transparent to-transparent"
                style={{ animation: 'scan 3s linear infinite' }}
            ></div>
        </div>
    )
}
