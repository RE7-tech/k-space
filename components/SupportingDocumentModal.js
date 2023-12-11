import Badge from "./Badge";
import { statusBadgeMap } from "@/utils/supportingDocuments";
import FileUploader from "./FileUploader";
import Button from "./Button";
import { useEffect, useState } from "react";
import { uploadPolicySupportingDocument } from "@/lib/api/documents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { SelectedFile } from "./FileUploader";
import Alert from "./Alert";
import makeFusion from "@/lib/api/utils";

export function SupportingDocumentChoice({ choice, onClick }) {
    return <>
        <div onClick={onClick} className="flex flex-col items-center justify-center gap-4 flex-1 bg-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-100">
            <h4 className="text-xl font-bold text-blue-900 text-center">
                {choice?.value}
            </h4>
            <p className="text-gray-500 text-sm">
                {choice.short_description}
            </p>
        </div>
    </>
}

export default function SupportingDocumentModal({ supportingDocument, policy, onClose, onChange, children }) {

    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [filesStates, setFilesStates] = useState({});

    const [completedParts, setCompletedParts] = useState([]);
    const [currentPart, setCurrentPart] = useState(null);
    const [currentChoice, setCurrentChoice] = useState(null);
    const [isMergeValidated, setIsMergeValidated] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const [isMergeLoading, setIsMergeLoading] = useState(false);
    const [fusionUrl, setFusionUrl] = useState(null);
    const [fusionData, setFusionData] = useState(null);

    const [maxFiles, setMaxFiles] = useState(1);

    const acceptedFileTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg', 'image/heic', 'image/heif'];
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    const parts = supportingDocument?.parts ?? [];
    const choices = supportingDocument?.choices ?? [];

    const handleFileChange = async (newFiles) => {
        setFiles([...files, ...Array.from(newFiles)]);
    }

    const handleSubmit = async () => {
        setIsUploading(true);

        for (const file of files) {
            try {
                // Change file uploading state
                setFilesStates(prevState => {
                    return { ...prevState, [file?.name]: { isUploading: true, isUploaded: false, isUploadFailed: false } };
                });

                // Check file type
                if (!acceptedFileTypes.includes(file?.type)) {
                    throw new Error('Le fichier est invalide il doit être au format ' + acceptedFileTypes.map(t => t.split('/')[1]).join(', ') + '.');
                }

                // Check file size
                if (file?.size > maxFileSize) {
                    throw new Error('Le fichier est trop volumineux il doit faire moins de ' + maxFileSize + ' octets.');
                }

                // Add file to completed parts
                setCompletedParts([...completedParts, currentPart?.key]);

                setError((prevState) => {
                    return { ...prevState, [file?.name]: null };
                });

                // Change file uploading state
                setFilesStates(prevState => {
                    return { ...prevState, [file?.name]: { isUploading: false, isUploaded: true, isUploadFailed: false } };
                });

            } catch (error) {

                // Change file uploading state
                setFilesStates(prevState => {
                    return { ...prevState, [file?.name]: { isUploading: false, isUploaded: false, isUploadFailed: true } };
                });

                if (error?.response?.status === 422) {
                    setError((prevState) => {
                        return { ...prevState, [file?.name]: "Le fichier est invalide il doit être au format PDF, PNG ou JPG." };
                    });
                } else {
                    setError((prevState) => {
                        return { ...prevState, [file?.name]: error?.message ?? "Une erreur est survenue lors de l'envoi du fichier." };
                    });
                }
            }
        }

        // remove empty errors
        setError((prevState) => {
            return Object.keys(prevState ?? {}).reduce((acc, key) => {
                if (prevState[key] !== null) {
                    acc[key] = prevState[key];
                }
                return acc;
            }, {});
        });

        setIsUploading(false);
    }

    const uploadFile = async (file) => {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('scope', supportingDocument?.scope);
        formData.append('type', currentChoice?.type);
        formData.append('subtype', currentChoice?.subtype);
        formData.append('part', 'FULL');
        formData.append('supporting_document_id', supportingDocument?.id);

        const { data } = await uploadPolicySupportingDocument(policy?.id, formData);

        return data;
    }

    const handleFileDelete = (file) => {
        setFiles(prevState => {
            return prevState.filter(f => f !== file);
        });
    }

    const canSendFiles = () => {
        return files.length > 0;
    }

    const getNextPart = () => {
        if (Object.keys(parts).length > 0) {
            return parts.find(p => !completedParts.includes(p.key));
        } else if (Object.keys(currentChoice?.parts ?? {}).length > 0) {
            return currentChoice?.parts?.find(p => !completedParts.includes(p.key));
        } else if (!parts || parts.length <= 0) {
            if (completedParts.includes('FULL')) {
                return null;
            } else {
                return { key: 'FULL', value: 'document complet' };
            }
        }
    }

    const isAllPartsCompleted = () => {
        if (Object.keys(parts).length > 0) {
            return parts.every(p => completedParts.includes(p.key));
        } else if (Object.keys(currentChoice?.parts ?? {}).length > 0) {
            return currentChoice?.parts?.every(p => completedParts.includes(p.key));
        } else if (!parts || parts.length <= 0) {
            return completedParts.includes('FULL');
        }
    }

    const handlePartsMerge = async () => {
        try {
            setIsMergeLoading(true);

            if (files?.length >= 2) {
                const formData = new FormData();

                formData.append('file1', files[0]);
                formData.append('file2', files[1]);

                const response = await makeFusion(formData);
                const data = response.data;

                const url = URL.createObjectURL(data);

                setFusionUrl(url);
                setFusionData(data);

                // add file to files
                const newFile = new File([data], 'merge', { type: response.headers['content-type'] });

                setFiles([newFile]);
            } else {
                const url = URL.createObjectURL(files[0]);

                setFusionUrl(url);
            }

        } catch (error) {
            console.log(error);
            setError({
                'merge': 'Une erreur est survenue lors de la fusion des pièces justificatives.'
            });
        } finally {
            setIsMergeLoading(false);
        }
    }

    const handleValidateUpload = async () => {
        try {
            setIsUploading(true);

            await uploadFile(files[0]);

            setIsMergeValidated(true);

            onChange();

        } catch (error) {

            console.error('handleValidateUpload', error);

        } finally {
            setIsUploading(false);
        }
    }

    const isFileUploaderDisabled = () => {

        if (files.length >= supportingDocument.max_parts) {
            return true;
        }

        if (isMergeValidated) {
            return true;
        }

        if (isMergeLoading) {
            return true;
        }

        return false;
    }

    useEffect(() => {
        setCurrentPart(getNextPart());
    }, [currentChoice]);

    useEffect(() => {
        // Show next part
        setCurrentPart(getNextPart());

        // If all parts are completed
        if (isAllPartsCompleted()) {
            setIsCompleted(true);
        }

    }, [completedParts]);

    useEffect(() => {
        if (choices.length <= 0) {
            setCurrentChoice(supportingDocument);
        }
    }, []);

    useEffect(() => {
        if (isCompleted) {
            handlePartsMerge();
        }
    }, [isCompleted]);

    useEffect(() => {

    }, [isMergeValidated]);

    console.log('supporting document', supportingDocument, currentChoice, currentPart);
    console.log('errors', error);
    console.log('files', files);

    return <>

        {/* Backdrop */}
        <div className="absolute bg-black opacity-50 top-0 left-0 bottom-0 right-0 z-[49] cursor-pointer" onClick={onClose}></div>

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-2xl">
                {/* Header */}
                <div className="flex flex-col justify-between items-start mb-4 pb-2 border-b-2 border-gray-200">
                    {/* Title */}

                    <div className="flex items-center gap-4 justify-between w-full">
                        <h4 className="text-2xl font-bold text-blue-900">
                            {supportingDocument?.label ?? '...'}
                        </h4>


                        <div className="flex items-center gap-4">
                            {statusBadgeMap(supportingDocument)}

                            <FontAwesomeIcon icon={faTimes} width={18} height={18} className="text-gray-400 cursor-pointer" onClick={onClose} />
                        </div>

                    </div>

                    {supportingDocument?.description ? <p className="text-gray-500 text-sm">
                        {supportingDocument?.description ?? '...'}
                    </p> : null}
                </div>

                {error && Object.keys(error)?.length > 0 ? <>
                    <div className="mb-4">
                        <Alert variant="error">
                            {Object.keys(error).map((key, idx) => {
                                return <>{error[key]}<br /></>
                            })}
                        </Alert>
                    </div>
                </> : null}

                {/* If no choice was made yet and there are choices */}
                {currentChoice === null && (choices ?? []).length > 0 ? <>
                    <div className="flex flex-row gap-4 pb-4">

                        {(choices ?? []).map((choice, idx) => {
                            return <>
                                <SupportingDocumentChoice key={idx} choice={choice} onClick={() => setCurrentChoice(choice)} />
                            </>
                        })}

                    </div>
                </> : null}

                {currentChoice !== null && currentPart ? <>
                    <div className="flex flex-col gap-4 pb-4">

                        {currentPart.key !== 'FULL' ? <div className="text-gray-500">
                            Veuillez déposer le <strong>{currentPart.value}</strong> de votre <strong>{currentChoice.value}</strong>.
                        </div> : <>
                            {supportingDocument?.metadata?.description ? <p className="text-gray-500">
                                {supportingDocument?.metadata?.description ?? '...'}
                            </p> : null}
                        </>}

                        {/* Upload */}
                        <FileUploader
                            isDisabled={isFileUploaderDisabled()}
                            onChange={handleFileChange}
                            accept={acceptedFileTypes}
                            maxSize={maxFileSize} />

                        {/* Files states */}
                        <div className="flex flex-col gap-4 max-h-[200px] pr-2 overflow-y-auto">
                            {(files ?? [])?.map((file, index) => {
                                return <SelectedFile
                                    key={index}
                                    file={file}
                                    onDelete={handleFileDelete}
                                    isUploading={filesStates[file?.name]?.isUploading}
                                    isUploaded={filesStates[file?.name]?.isUploaded}
                                    isUploadFailed={filesStates[file?.name]?.isUploadFailed}
                                />
                            })}
                        </div>

                        <Button variant="primary" className="w-full" onClick={handleSubmit} isLoading={isUploading} disabled={!canSendFiles()}>
                            Envoyer
                        </Button>

                    </div>
                </> : null}

                {/* When all parts are completed and merge is not validated */}
                {currentChoice !== null && isAllPartsCompleted() && !isMergeValidated ? <>
                    <div className="flex flex-col gap-4 pb-4">

                        {isMergeLoading ? <>
                            <div className="flex items-center justify-center mx-auto">
                                <FontAwesomeIcon icon={faSpinner} size="6x" className="text-gray-400" spin />
                            </div>

                            <div className="text-gray-500 text-center text-2xl">
                                Veuillez patienter nous sommes en train de fusionner vos pièces justificatives.
                            </div>
                        </> : null}

                        <div className="flex items-center justify-center mx-auto max-h-[400px] overflow-y-auto">

                            <img src={`${fusionUrl}`} alt="resulat de la fusion" />

                        </div>

                        <div className="flex flex-row justify-between items-center gap-4">

                            <Button variant="outline_primary" className="w-full" onClick={onClose}>
                                Recommencer
                            </Button>

                            {Object.keys(error ?? {}).length <= 0 ? <Button variant="primary" className="w-full" onClick={handleValidateUpload} isLoading={isUploading}>
                                Valider
                            </Button> : null}

                        </div>

                    </div>
                </> : null}

                {/* When all parts are completed and merge is validated */}
                {currentChoice !== null && isAllPartsCompleted() && isMergeValidated ? <>
                    <div className="flex flex-col gap-4 pb-4">

                        <div className="flex items-center justify-center mx-auto">
                            <FontAwesomeIcon icon={faCheckCircle} size="6x" className="text-green-500" />
                        </div>

                        <div className="text-gray-500 text-center text-2xl">
                            Merci pour votre envoi !
                        </div>

                        <p className="text-gray-500 text-center">
                            Nous allons procéder à la validation de votre pièce justificative dans les plus brefs délais.
                        </p>

                        <Button variant="primary" className="w-full" onClick={onClose}>
                            Fermer
                        </Button>

                    </div>
                </> : null}
            </div>
        </div>

    </>

}