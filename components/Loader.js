export default function Loader ({ message }) {
    return <>
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-6 border-red-1000"></div>
                {message && <div className="mt-4">{message}</div>}
            </div>
        </div>
    </>
}