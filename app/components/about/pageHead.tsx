import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

export default function PageHead({ title }: { title: string }) {
    const _title = title.replace(/ /g, '_')
    return (
        <>
            <div className="border-terminal w-full text-xl uppercase select-none">
                <CRTOverlay />
                <TextJitter>
                    <strong>
                        <p className={`before:content-['>_']`}>{_title}</p>
                    </strong>
                </TextJitter>
            </div>
            <div className="divider my-1"></div>
        </>
    )
}
