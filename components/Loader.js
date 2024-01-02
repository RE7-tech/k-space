import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loader ({ message }) {
    return <>
        <div className="flex flex-col items-center justify-center w-full vh-80 p-12">
            <div className="flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} size="3x" spin={true} className="text-primary" />
                {message && <div className="mt-4">{message}</div>}
            </div>
        </div>
    </>
}