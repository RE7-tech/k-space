export default function PageTitle({ children, subtitle, subtitleClassName }) {
    return <>
        <div className="flex flex-col gap-3 justify-between w-full">
            <h2 className="text-4xl font-bold">
                {children}
            </h2>
            {subtitle && <h3 className={`text-2xl font-bold ${subtitleClassName}`}>
                {subtitle}
            </h3>}
        </div>
    </>
}