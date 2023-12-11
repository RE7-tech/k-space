import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Button ({ variant, size = 'md', form, type = 'button', label, className, disabled, children, onClick, isLoading, isChecked = null, isFullWidth = false }) {

    let baseStyle = 'relative flex flew-row justify-center gap-2 items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

    let variantStyle = {
        primary: 'text-white bg-primary border border-transparent hover:bg-red-700 focus:ring-red-500',
        outline_primary: 'text-primary bg-white border border-primary hover:bg-red-50 focus:ring-red-500',
        choice: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
        link: 'text-gray-700 bg-white border border-transparent hover:bg-gray-50 focus:ring-gray-500',
    };

    let sizeStyle = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-2 py-4 text-xs font-bold',
        lg: 'px-6 py-4 text-lg',
    };

    let disabledStyle = 'opacity-50 cursor-not-allowed';

    let btnClassNames = `${baseStyle} ${variantStyle[variant]} ${sizeStyle[size]} ${disabled ? disabledStyle : ''}  ${isFullWidth ? 'w-full' : ''} ${className}`;

    return <>
        <button className={btnClassNames} onClick={onClick} form={form} type={type} disabled={disabled}>
            {label || children}
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}

            {/* Top right corner */}
            {isChecked === true && <div className="absolute top-[-12px] right-[-12px] bg-blue-100 rounded-full border-2 border-blue-500 flex items-center justify-center h-6 w-6">
                <FontAwesomeIcon icon={faCheck} className="text-blue-500" />
            </div>}
        </button>
    </>
}