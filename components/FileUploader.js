import Button from "./Button";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner, faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export function SelectedFile({ file, onDelete, isUploading = false, isUploaded = false, isUploadFailed = false }) {
    return <>
        <div className={`flex items-center gap-4 bg-gray-50 p-4 rounded-md flex-1 rounded-xl relative cursor-pointer hover:bg-gray-100 justify-between ${isUploading ? 'opacity-50' : ''} ${isUploaded ? 'bg-green-100 border-green-400' : ''} ${isUploadFailed ? 'bg-red-100 border-red-400' : ''}`}>
            {isUploading && <FontAwesomeIcon icon={faSpinner} width={18} height={18} spin className="text-gray-400" />}
            {isUploaded && <FontAwesomeIcon icon={faCheckCircle} width={18} height={18} className="text-green-400" />}
            {isUploadFailed && <FontAwesomeIcon icon={faExclamationTriangle} width={18} height={18} className="text-red-400" />}

            <span className="text-gray-400 text-lg">
                {file?.name ?? "..."}
            </span>
            <FontAwesomeIcon icon={faTimes} width={18} height={18} onClick={() => onDelete(file)} className="text-gray-400 cursor-pointer" />
        </div>
    </>
}

export default function FileUploader({ onChange, accept, maxFileSize = 1000000, isDisabled = false, allowMultiple = false }) {

    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);

    const handleBrowse = (e) => {
        e.stopPropagation();
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        e.stopPropagation();
        const newFiles = e.target.files;
        setFiles([...Array.from(newFiles)]);
    }

    const handleFile = (newFiles) => {
        setFiles([...newFiles]);
    }

    // handle drag events
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files);
        }
    };

    const canBrowse = () => {
        return !isDisabled;
    }

    useEffect(() => {

    }, []);

    useEffect(() => {
        if (files.length > 0) {
            onChange(files);
        }
    }, [files]);

    let classNames = `border-2 border-red-200 border-dashed rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center gap-4 transition-all duration-200 ${dragActive ? 'border-red-400' : ''}`;

    if (canBrowse()) {
        classNames += ' cursor-pointer hover:border-red-400';
    } else {
        classNames += ' cursor-not-allowed opacity-50 filter:grayscale';
    }

    return <>
        <div className={classNames} onDragEnter={handleDrag} onClick={handleBrowse} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>

            <div className="flex flex-col items-center justify-center gap-4">
                <span className="text-gray-400 text-2xl">
                    Déposez vos fichiers ici
                </span>

                <span className="text-gray-400 text-xl">
                    ou
                </span>

                <input type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} accept={accept} multiple={allowMultiple} />

                <Button variant="outline_primary" className="w-full" onClick={handleBrowse} disabled={!canBrowse()}>
                    Parcourir
                </Button>
            </div>

        </div>
    </>
}