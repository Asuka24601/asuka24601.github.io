export default function CRTScreen({ className }: { className?: string }) {
    return (
        <div
            className={
                'pointer-events-none absolute inset-0' +
                (className ? ' ' + className : '')
            }
        >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_3px,3px_100%]"></div>
        </div>
    )
}
