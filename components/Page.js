export default function Page ({ children, centeredVertically = false }) {

    return <>
        <div className={`md:px-12 md:py-6 px-4 py-4 w-full `}>
            {children}
        </div>
    </>

}