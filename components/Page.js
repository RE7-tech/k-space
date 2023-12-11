export default function Page ({ children }) {

    return <>
        <div className="md:px-12 md:py-6 px-4 py-4">
            {children}
        </div>
    </>

}