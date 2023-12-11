export default function Card({ children, header, sizeMode, className }) {

    const cardClassNames = `p-4 shadow-opaque rounded-xl bg-white border border-gray-200  ${sizeMode === 'adaptive' ? 'h-fit-content' : 'min-h[200px] h-full'} ${className ?? ''}`

    return <div className={cardClassNames}>
        {header && <div className="">
            {header}
        </div>}
        <div>
            {children}
        </div>
    </div>
}