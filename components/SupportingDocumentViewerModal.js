import usePolicySupportingDocumentParts from '../hooks/usePolicySupportingDocumentParts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileImage, faFilePdf, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import download from 'downloadjs';
import Image from 'next/image';

export default function SupportingDocumentViewerModal({
    policy,
    supportingDocument,
    partId,
    onClose,
    onPartChange,
}) {

    const { supportingDocumentParts, loading, error } = usePolicySupportingDocumentParts(policy?.id, supportingDocument?.id);

    const [selectedPart, setSelectedPart] = useState(null);

    const mimeTypeIcons = {
        'application/pdf': <FontAwesomeIcon icon={faFilePdf} size="2x" className="text-gray-400" />,
        'image/png': <FontAwesomeIcon icon={faFileImage} size="2x" className="text-gray-400" />,
        'image/jpeg': <FontAwesomeIcon icon={faFileImage} size="2x" className="text-gray-400" />,
        'image/jpg': <FontAwesomeIcon icon={faFileImage} size="2x" className="text-gray-400" />,
        'image/gif': <FontAwesomeIcon icon={faFileImage} size="2x" className="text-gray-400" />,
        default: <FontAwesomeIcon icon={faFileImage} size="2x" className="text-gray-400" />,
    };

    const partLabels = {
        'front': 'Recto',
        'back': 'Verso',
        'other': 'Autre',
        'full': 'Tout',
        default: '',
    }

    const getMimeTypeIcon = (mimeType) => {
        return mimeTypeIcons[mimeType] ?? mimeTypeIcons['default'];
    }

    const getPartLabel = (part) => {
        console.log('part', part);
        return partLabels[part?.part?.toLowerCase()] ?? partLabels['default'];
    }

    const handlePartClick = (part) => {
        setSelectedPart(part);
    }

    const getViewerComponent = (part) => {
        if (!part) {
            return null;
        }

        if (part?.mimetype?.startsWith('image')) {
            return <Image src={`data:${part?.mimetype};base64,${part?.base64}`} alt="part view" className="w-full h-full object-contain" />
        }

        if (part?.mimetype?.startsWith('application/pdf')) {
            return <iframe src={`data:application/pdf;base64,${part?.base64}`} className="w-full h-[80vh]"></iframe>
        }

        return <div className="flex flex-col justify-center items-center">
            Impossible d'afficher ce type de fichier
        </div>
    }

    const downloadPart = (part) => {
        // use downloadjs to download the file
        download(`data:${part?.mimetype};base64,${part?.base64}`, part?.filename, part?.mimetype);
    }

    useEffect(() => {

        if (supportingDocumentParts?.length > 0) {
            setSelectedPart(supportingDocumentParts[0]);
        }

    }, [supportingDocumentParts]);

    return <>

        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>

        {/* Modal */}
        <div className="fixed inset-0 flex flex-col items-center justify-center max-w-2xl w-full mx-auto z-50">

            <div className="flex justify-end items-center gap-4 w-full mb-4 text-white">
                <FontAwesomeIcon icon={faDownload} size="2x" className="text-gray-400 cursor-pointer text-white hover:text-gray-300"
                    onClick={() => downloadPart(selectedPart)} />
                <FontAwesomeIcon icon={faTimes} size="2x" className="text-gray-400 cursor-pointer text-white hover:text-gray-300"
                    onClick={onClose} />
            </div>

            <div className="flex flex-row justify-between items-start gap-4 w-full">

                <div className="bg-white rounded-md shadow-xl p-4 flex-1 rounded-xl relative">

                    {loading ? <>
                        <div className="flex items-center justify-center">
                            <FontAwesomeIcon icon={faSpinner} width={18} height={18} spin className="text-gray-400" />
                        </div>
                    </> : <>

                        <div className="flex flex-col justify-between items-start overflow-y-auto max-h-[80vh]">


                            {/* Show the base 64 of the selected part */}
                            {getViewerComponent(selectedPart)}


                        </div>

                    </>}

                </div>

                <div className="flex flex-col justify-between items-start gap-4">
                    {supportingDocumentParts?.length > 0 ? <>
                        {supportingDocumentParts.map((part, idx) => {
                            return <div key={idx} onClick={() => handlePartClick(part)} className={`flex flex-col gap-4 cursor-pointer bg-white rounded-md shadow-xl p-4 ${selectedPart === part ? 'border-2 border-blue-500' : ''}`}>
                                <div className="flex flex-col justify-center items-center">
                                    {getMimeTypeIcon(part?.mimetype)}
                                </div>
                                <div>
                                    {getPartLabel(part)}
                                </div>
                            </div>
                        })}
                    </> : null}
                </div>

            </div>

        </div>

    </>

}