'use client';

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import DesktopTopbar from "@/components/DesktopTopbar";
import Highlight from "@/components/Highlight";
import InputField from "@/components/InputField";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import { faCheck, faCheckCircle, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import FileUploader from "@/components/FileUploader";
import { saveClaim, addClaimAttachment } from "@/lib/api/claims";
import PolicySmallCard from "@/components/PolicySmallCard";
import useCustomerPolicies from "@/hooks/useCustomerPolicies";
import useCustomer from "@/hooks/useCustomer";
import { getPolicy } from "@/lib/api/policies";

export function WitnessForm({ witness, onChange }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...witness, [name]: value });
    }

    return <>
        <div className="flex flex-col gap-4 border border-gray-300 rounded-md p-4">
            <div className="flex flex-col lg:flex-row gap-4">
                <InputField name="lastname" label="Nom" placeholder="Nom" onChange={handleChange} />
                <InputField name="firstname" label="Prénom" placeholder="Prénom" onChange={handleChange} />
            </div>

            <InputField name="address" label="Adresse" placeholder="Adresse" onChange={handleChange} />
            <InputField name="address2" label="Complément d'adresse" placeholder="Complément d'adresse" onChange={handleChange} />

            <InputField name="phone" label="Téléphone" placeholder="Téléphone" onChange={handleChange} />
            <InputField name="email" label="Email" placeholder="Email" onChange={handleChange} />

            <div className="flex flex-col lg:flex-row gap-4">
                <InputField name="zipcode" label="Code postal" placeholder="Code postal" onChange={handleChange} />
                <InputField name="city" label="Ville" placeholder="Ville" onChange={handleChange} />
            </div>
        </div>
    </>
}

export function PartyForm({ party, onChange }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...party, [name]: value });
    }

    return <>
        <div className="flex flex-col gap-4 border border-gray-300 rounded-md p-4">
            <div className="flex flex-col lg:flex-row gap-4">
                <InputField name="lastname" label="Nom" placeholder="Nom" onChange={handleChange} />
                <InputField name="firstname" label="Prénom" placeholder="Prénom" onChange={handleChange} />
            </div>

            <InputField name="address" label="Adresse" placeholder="Adresse" onChange={handleChange} />
            <InputField name="complement_address" label="Complément d'adresse" placeholder="Complément d'adresse" onChange={handleChange} />

            <InputField name="phone" label="Téléphone" placeholder="Téléphone" onChange={handleChange} />
            <InputField name="email" label="Email" placeholder="Email" onChange={handleChange} />

            {/* Two columns on desktop, one column on mobile */}
            <div className="flex flex-col lg:flex-row gap-4">
                <InputField name="zipcode" label="Code postal" placeholder="Code postal" onChange={handleChange} />
                <InputField name="city" label="Ville" placeholder="Ville" onChange={handleChange} />
            </div>
        </div>
    </>
}

export default function NewClaim({ children, params = {} }) {

    let policyId = params?.policyId;

    if (Array.isArray(policyId) && policyId[0]) {
        policyId = policyId[0];
    }

    const { customer } = useCustomer();
    const [currentStep, setCurrentStep] = useState(0);
    const [claimTypes, setClaimTypes] = useState([
        { value: 'accident', label: 'Accident' },
        { value: 'theft', label: 'Vol' },
        { value: 'fire', label: 'Incendie' },
        { value: 'other', label: 'Autre' },
    ]);
    const [policy, setPolicy] = useState(null);

    const router = useRouter();

    const [claim, setClaim] = useState({
        version: 2,
        policyId: policyId ?? null,
    });

    const [documents, setDocuments] = useState({
        constat: false,
        pv: false,
        photos: false,
        others: false
    });

    const [parties, setParties] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [policyLoading, setPolicyLoading] = useState(false);

    const { policies: customerPolicies } = useCustomerPolicies();

    const filesRef = {
        constat: useRef(null),
        pv: useRef(null),
        photos: useRef(null),
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        // handle checkbox multiple choices
        if (name === 'established') {
            const { checked } = e.target;

            let established = claim?.established ?? [];

            if (Array.isArray(established) === false) {
                established = [];
            }

            value = checked ? [...established, value] : established.filter((v) => v !== value);
        }

        setClaim({ ...claim, [name]: value });
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (files.length === 0) {
            return;
        }

        let newDocuments = { ...documents };

        // handle multiple files
        if (files.length > 1) {
            newDocuments[name] = files;
        } else {
            newDocuments[name] = files[0];
        }

        setDocuments(newDocuments);
    }

    const handleStepSubmit = (e, step) => {
        e.preventDefault();
        console.log('submit step', step);
        setCurrentStep(step + 1);
        saveDraftInBrowser();
    }

    const validateStep = () => {
        let newErrors = {};

        if (currentStep === 0) {

            const requiredFields = [
                'claimType',
                'claimDate',
                'claimHour',
                'claimPlace',
                'claimCity',
                'claimZipcode',
                'claimCircumstances',
            ];

            newErrors = requiredFields.reduce((acc, field) => {
                if (!claim[field]) {
                    acc[field] = 'Ce champ est requis';
                }
                return acc;
            }, {});

            // The claim date and hour must be in the past
            const claimDate = new Date(claim?.claimDate);
            const claimHour = new Date(claim?.claimHour);

            const now = new Date();

            if (claimDate > now) {
                newErrors.claimDate = 'La date du sinistre doit être dans le passé';
            }

            if (claimDate > now && claimHour > now) {
                newErrors.claimHour = 'La date et l\'heure du sinistre doivent être dans le passé';
            }

        }

        if (currentStep === 1) {

            if (claim?.materialDommage === undefined) {
                newErrors.materialDommage = 'Ce champ est requis';
            }

            if (claim?.materialDommage) {
                if (!claim?.materialDammageDescription) {
                    newErrors.materialDammageDescription = 'Ce champ est requis';
                }
            }

            if (claim?.bodilyDommage === undefined) {
                newErrors.bodilyDommage = 'Ce champ est requis';
            }

            if (claim?.bodilyDommage) {
                if (!claim?.bodilyDammageDescription) {
                    newErrors.bodilyDammageDescription = 'Ce champ est requis';
                }
            }

        }

        if (currentStep === 2) {

            if (claim?.vehicleWorking === undefined) {
                newErrors.vehicleWorking = 'Ce champ est requis';
            }

            if (!claim?.vehicleAddress) {
                newErrors.vehicleAddress = 'Ce champ est requis';
            }

            if (!claim?.vehicleCity) {
                newErrors.vehicleCity = 'Ce champ est requis';
            }

            if (!claim?.vehicleZipcode) {
                newErrors.vehicleZipcode = 'Ce champ est requis';
            }

        }

        if (currentStep === 3) {

            if (!claim?.deplacementType) {
                newErrors.deplacementType = 'Ce champ est requis';
            }
        }

        if (currentStep === 4) {

            if (claim?.hasWitnesses === undefined) {
                newErrors.hasWitnesses = 'Ce champ est requis';
            }

            if (claim?.hasWitnesses) {
                if (!claim?.witnesses?.length) {
                    newErrors.witnesses = 'Ce champ est requis';
                }
            }

        }

        if (currentStep === 5) {

        }

        if (currentStep === 6) {

            if (!documents?.constat && claim?.established?.includes('constat')) {
                newErrors.constat = 'Ce champ est requis';
            }

            if (!documents?.pv && claim?.established?.includes('pv')) {
                newErrors.pv = 'Ce champ est requis';
            }

            if (!documents?.photos && ['home', 'mrh', 'habitation'].includes(policy?.product?.type)) {
                newErrors.photos = 'Ce champ est requis';
            }

        }

        if (currentStep === 7) {

            if (claim?.hasParties === undefined) {
                newErrors.hasParties = 'Ce champ est requis';
            }

            if (claim?.hasParties) {
                if (!claim?.parties?.length) {
                    newErrors.parties = 'Ce champ est requis';
                }
            }

        }

        setErrors(newErrors);
    }

    const canSubmit = (currentStep) => {
        return Object.keys(errors).length === 0;
    }

    const saveDraftInBrowser = () => {
        sessionStorage.setItem('new_claim', JSON.stringify(claim));
    }

    const handleBrowse = (e) => {
        e.stopPropagation();

        if (!filesRef[e.target.name]?.current) {
            return;
        }

        filesRef[e.target.name].current.click();
    }

    const hasFile = (key) => {
        return documents[key] !== false;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSaved(false);
        setIsSaving(true);

        try {
            const { data: claimResp } = await saveClaim({
                policy_id: claim?.policyId,
                data: claim,
            });

            const createdClaim = claimResp?.data;

            console.log('createdClaim', createdClaim);

            for (const [key, file] of Object.entries(documents)) {
                console.log('adding attachment', key, file);

                if (file === false) {
                    continue;
                }

                let filesToUpload = [];

                if (file instanceof FileList) {
                    filesToUpload = [...file];
                } else if (file instanceof File) {
                    filesToUpload = [file];
                }

                for (let fileToUpload of filesToUpload) {
                    const formData = new FormData();
                    formData.append('claim_id', createdClaim?.id);
                    formData.append('attachment', fileToUpload);

                    const { addClaimAttachmentResp } = await addClaimAttachment(createdClaim?.id, formData);
                }
            }

            // delete draft
            sessionStorage.removeItem('new_claim');

            setIsSaved(true);
        } catch (e) {
            console.error(e);
            setErrors({
                generic: 'Une erreur est survenue'
            });
            setIsSaved(false);
        } finally {
            setIsSaving(false);
        }

    }

    const loadPolicy = async () => {
        if (!claim?.policyId) {
            return;
        }

        setPolicyLoading(true);

        try {
            const { data: policyResp } = await getPolicy(claim?.policyId);

            setPolicy(policyResp?.data);

        } catch (e) {

            console.error(e);

        } finally {

            setPolicyLoading(false);

        }

    }

    useEffect(() => {
        validateStep();
    }, [claim, currentStep, documents]);

    useEffect(() => {
        setClaim({
            ...claim, ...{
                contactEmail: customer?.primary_email ?? '',
                contactPhone: customer?.mobile_phone ?? '',
                contactAddress: customer?.address ?? '',
                contactZipcode: customer?.postal_code ?? '',
                contactCity: customer?.city ?? '',
                contactFirstname: customer?.firstname ?? '',
                contactLastname: customer?.lastname ?? '',
                contactComplementAddress: customer?.address2 ?? ''
            }
        });
    }, [customer]);

    useEffect(() => {
        if (isSaved === true) {
            setTimeout(() => {
                router.push('/claims');
            }, 2000);
        }
    }, [isSaved]);

    useEffect(() => {

        // change the url when the policy changes
        if (claim.policyId) {
            router.replace('/claims/new/' + claim.policyId);
        }

    }, [claim.policyId]);

    useEffect(() => {

        // load the draft from the session storage
        const draft = sessionStorage.getItem('new_claim');

        if (draft) {
            setClaim(JSON.parse(draft));
        }

        loadPolicy();

    }, [claim?.policyId]);

    useEffect(() => {
        if (['mrh', 'home', 'habitation'].includes(policy?.product?.type)) {
            // remove accident from the claim types
            setClaimTypes(claimTypes.filter((claimType) => claimType?.value !== 'accident'));
        }
    }, [policy]);

    if (policyLoading) {
        return <>
            <Page>
                <div className="flex flex-col items-center justify-center gap-4">
                    <FontAwesomeIcon icon={faSpinner} size="2x" spin={true} />
                    <p>
                        Chargement du formulaire...
                    </p>
                </div>
            </Page>
        </>
    }

    console.log('claim', claim, errors, documents);

    return <>
        <Page>
            <DesktopTopbar breadcrumbs={[
                {
                    href: '/claims',
                    name: 'Mes sinistres'
                },
                {
                    href: '/claims/new',
                    name: 'Nouveau sinistre'
                }
            ]} />

            <div className="">
                <PageTitle>
                    Nouveau <Highlight>sinistre</Highlight>
                </PageTitle>

                {/* <pre>
                    {JSON.stringify(claim, null, 2)}
                </pre> */}

                <div className="mt-8">
                    <div className="lg:max-w-2xl">

                        {isSaving || isSaved ? <>

                            {isSaving ? <>

                                <div className="flex flex-col items-center justify-center gap-4">

                                    <FontAwesomeIcon icon={faSpinner} size="2x" className="text-4xl text-gray-400 animate-spin" />

                                    <span className="text-gray-400 mt-4">
                                        Enregistrement en cours...
                                    </span>

                                </div>

                            </> : null}

                            {isSaved ? <>

                                <div className="flex flex-col items-center justify-center gap-4">

                                    <FontAwesomeIcon icon={faCheckCircle} size="2x" className="text-4xl text-green-400" />

                                    <span className="text-gray-400 mt-4">
                                        Enregistré !
                                    </span>

                                </div>

                            </> : null}
                        </>
                            : <>

                                {!claim.policyId ? <>
                                    <div className="flex flex-col gap-4">

                                        <div className="flex flex-col gap-4 mb-4">
                                            Quel est le contrat concerné ?
                                        </div>

                                        {customerPolicies?.length > 0 ? <>

                                            {customerPolicies?.map((policy, idx) => {
                                                return <PolicySmallCard isBordered={true} key={idx} policy={policy} onClick={() => {
                                                    setClaim({ ...claim, policyId: policy?.id });
                                                    setCurrentStep(0);
                                                }} />
                                            })}

                                        </> : <>

                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <span className="text-gray-400">
                                                    Vous n'avez pas de contrat en cours.
                                                </span>
                                            </div>

                                        </>}
                                    </div>
                                </> : <>

                                    {currentStep === 0 ?
                                        <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>

                                            <InputField value={claim.claimType} name="claimType" label="Type de sinistre" placeholder="Type de sinistre" choices={claimTypes} onChange={handleChange} />

                                            {/* Two columns, date and time */}
                                            <div className="flex flex-col lg:flex-row gap-4">
                                                <InputField value={claim.claimDate} name="claimDate" label="Date du sinistre" type="date" placeholder="Date du sinistre" onChange={handleChange} isFullWidth={true} />
                                                <InputField value={claim.claimHour} name="claimHour" label="Heure du sinistre" type="time" placeholder="Heure du sinistre" onChange={handleChange} isFullWidth={true} />
                                            </div>

                                            {/* Claim place */}
                                            <InputField value={claim.claimPlace} name="claimPlace" label="Lieu du sinistre" placeholder="Lieu du sinistre" onChange={handleChange} />

                                            {/* Claim address complement */}
                                            <InputField value={claim.claimComplementAddress} name="claimComplementAddress" label="Complément d'adresse" placeholder="Complément d'adresse" onChange={handleChange} />

                                            {/* Claim city and zip code */}
                                            <div className="flex flex-col lg:flex-row gap-4">
                                                <InputField value={claim.claimCity} name="claimCity" label="Ville" placeholder="Ville" onChange={handleChange} isFullWidth={true} />
                                                <InputField value={claim.claimZipcode} name="claimZipcode" label="Code postal" placeholder="Code postal" onChange={handleChange} isFullWidth={true} />
                                            </div>

                                            {/* Claim circumstances */}
                                            <InputField value={claim.claimCircumstances} name="claimCircumstances" type="textarea" label="Circonstances" placeholder="Circonstances" onChange={handleChange} />

                                            {/* Back and next buttons */}
                                            <div className="grid grid-cols-2 gap-4 mt-8">
                                                <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                    Retour
                                                </Button>

                                                <Button variant="primary" type="submit" disabled={!canSubmit()}>
                                                    Suivant
                                                </Button>
                                            </div>
                                        </form>
                                        : null}

                                    {currentStep === 1 ?
                                        <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>

                                            {/* Material damage yes or no */}
                                            <div>
                                                <label className="block text-sm font-medium">
                                                    Dommage(s) matériel(s)
                                                </label>
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <Button isChecked={claim.materialDommage} variant="choice" onClick={() => setClaim({ ...claim, materialDommage: true })}>Oui</Button>
                                                    <Button isChecked={claim.materialDommage === false} variant="choice" onClick={() => setClaim({ ...claim, materialDommage: false })}>Non</Button>
                                                </div>
                                                {claim?.materialDommage ? <>
                                                    <div className="mt-4">
                                                        <InputField name="materialDammageDescription" type="textarea" label="Description des dommages" placeholder="Description des dommages" onChange={handleChange} />
                                                        <Alert variant="info" className="mt-4">
                                                            Les dégats matériels autres qu'à votre véhicule, et qui ne sont pas inscrits au recto du constat,
                                                            ne peuvent pas être réclamés au tiers.
                                                        </Alert>
                                                    </div>
                                                </> : null}
                                            </div>

                                            {/* Bodily damage yes or no */}
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium">
                                                    Dommage(s) corporel(s)
                                                </label>
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <Button isChecked={claim.bodilyDommage} variant="choice" onClick={() => setClaim({ ...claim, bodilyDommage: true })}>Oui</Button>
                                                    <Button isChecked={claim.bodilyDommage === false} variant="choice" onClick={() => setClaim({ ...claim, bodilyDommage: false })}>Non</Button>
                                                </div>
                                                {claim?.bodilyDommage ? <>
                                                    <div className="mt-4">
                                                        <InputField name="bodilyDammageDescription" type="textarea" label="Description des dommages" placeholder="Description des dommages" onChange={handleChange} />
                                                    </div>
                                                </> : null}
                                            </div>

                                            {/* Back and next buttons */}
                                            <div className="grid grid-cols-2 gap-4 mt-8">
                                                <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                    Précédent
                                                </Button>

                                                <Button variant="primary" type="submit" disabled={!canSubmit(currentStep)}>
                                                    Suivant
                                                </Button>
                                            </div>
                                        </form>
                                        : null}

                                    {currentStep === 2 ?
                                        <>
                                            <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>

                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium">
                                                        Votre véhicule est-il toujours roulant ?
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <Button isChecked={claim.vehicleWorking} variant="choice" onClick={() => setClaim({ ...claim, vehicleWorking: true })}>Oui</Button>
                                                        <Button isChecked={claim.vehicleWorking === false} variant="choice" onClick={() => setClaim({ ...claim, vehicleWorking: false })}>Non</Button>
                                                    </div>
                                                    {claim?.bodilyDommage ? <>
                                                        <div className="mt-4">
                                                            <InputField name="dammageDescription" type="textarea" label="Description des dommages" placeholder="Description des dommages" onChange={handleChange} />
                                                        </div>
                                                    </> : null}
                                                </div>

                                                {/* Address of the vehicle */}
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium">
                                                        A quelle adresse est-il stationné ?
                                                    </label>

                                                    <div className="mt-2">

                                                        <InputField value={claim.vehicleAddress} name="vehicleAddress" placeholder="Adresse du véhicule" onChange={handleChange} />
                                                        <InputField value={claim.vehicleComplementAddress} name="vehicleComplementAddress" placeholder="Complément d'adresse" onChange={handleChange} />

                                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                                            <InputField value={claim.vehicleCity} name="vehicleCity" placeholder="Ville" onChange={handleChange} isFullWidth={true} />
                                                            <InputField value={claim.vehicleZipcode} name="vehicleZipcode" placeholder="Code postal" onChange={handleChange} isFullWidth={true} />
                                                        </div>

                                                    </div>
                                                </div>

                                                {/* Back and next buttons */}
                                                <div className="grid grid-cols-2 gap-4 mt-8">
                                                    <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                        Précédent
                                                    </Button>

                                                    <Button variant="primary" type="submit" disabled={!canSubmit(currentStep)}>
                                                        Suivant
                                                    </Button>
                                                </div>

                                            </form>
                                        </>
                                        : null}

                                    {currentStep === 3 ?

                                        <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>

                                            <label className="block text-sm font-medium">
                                                Au moment du sinistre votre déplacement était d'ordre :
                                            </label>

                                            <InputField value={claim.deplacementType} name="deplacementType" placeholder={`Type de déplacement`} onChange={handleChange} choices={[
                                                { value: 'private', label: 'Privé' },
                                                { value: 'professional', label: 'Professionnel' },
                                                { value: 'other', label: 'Autre' },
                                            ]} />


                                            {/* Back and next buttons */}
                                            <div className="grid grid-cols-2 gap-4 mt-8">
                                                <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                    Précédent
                                                </Button>

                                                <Button variant="primary" type="submit" disabled={!canSubmit(currentStep)}>
                                                    Suivant
                                                </Button>
                                            </div>

                                        </form>
                                        : null}

                                    {currentStep === 4 ?
                                        <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>

                                            <div className="mt-4">
                                                <label className="block text-sm font-medium">
                                                    Y-a-t-il eu des témoins ?
                                                </label>

                                                <div className="grid grid-cols-2 gap-4 mt-4">

                                                    <Button variant="choice" onClick={() => {
                                                        setClaim({ ...claim, hasWitnesses: true, witnesses: [...(claim?.witnesses ?? []), {}] })
                                                    }} isChecked={claim?.hasWitnesses}>
                                                        Oui
                                                    </Button>

                                                    <Button variant="choice" onClick={() => setClaim({ ...claim, hasWitnesses: false })} isChecked={claim?.hasWitnesses === false}>
                                                        Non
                                                    </Button>

                                                </div>
                                            </div>

                                            {claim?.hasWitnesses ? <>


                                                {(claim?.witnesses ?? []).map((witness, idx) => {
                                                    return <>
                                                        <h5 className="text-md mt-4">
                                                            Témoin {idx + 1}
                                                        </h5>

                                                        <WitnessForm key={idx} witness={witness} onChange={(witness) => {
                                                            const witnesses = claim?.witnesses ?? [];
                                                            witnesses[idx] = witness;
                                                            setClaim({ ...claim, witnesses });
                                                        }} />

                                                    </>

                                                })}

                                                <Button variant="link" onClick={() => {
                                                    const witnesses = claim?.witnesses ?? [];
                                                    witnesses.push({});
                                                    setClaim({ ...claim, witnesses });
                                                }}>
                                                    Ajouter un témoin
                                                </Button>

                                            </> : null}

                                            {/* Back and next buttons */}
                                            <div className="grid grid-cols-2 gap-4 mt-8">
                                                <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                    Précédent
                                                </Button>

                                                <Button variant="primary" type="submit" disabled={!canSubmit(currentStep)}>
                                                    Suivant
                                                </Button>
                                            </div>

                                        </form>
                                        : null}

                                    {currentStep === 5 ?
                                        <>

                                            <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>

                                                <div>
                                                    <label className="block text-sm font-medium">
                                                        A t'il été établi ?<br />
                                                        (plusieurs réponses possibles)
                                                    </label>

                                                    <div className="flex flex-col gap-4 mt-4">

                                                        <InputField id="constat" isChecked={(claim.established ?? []).includes('constat')} value={'constat'} name="established" type="checkbox" label="Un constat" onChange={handleChange} />
                                                        <InputField id="pv" isChecked={(claim.established ?? []).includes('pv')} value={'pv'} name="established" type="checkbox" label="Un procès verbal de la gendarmerie" onChange={handleChange} />
                                                        <InputField id="police_report" isChecked={(claim.established ?? []).includes('police_report')} value={'police_report'} name="established" type="checkbox" label="Un rapport de police" onChange={handleChange} />
                                                        <InputField id="main_courante" isChecked={(claim.established ?? []).includes('main_courante')} value={'main_courante'} name="established" type="checkbox" label="Une main courante" onChange={handleChange} />

                                                    </div>
                                                </div>

                                                {/* Back and next buttons */}
                                                <div className="grid grid-cols-2 gap-4 mt-8">
                                                    <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                        Précédent
                                                    </Button>

                                                    <Button variant="primary" type="submit" disabled={!canSubmit(currentStep)}>
                                                        Suivant
                                                    </Button>
                                                </div>


                                            </form>

                                        </>
                                        : null}

                                    {currentStep === 6 ?
                                        <>
                                            <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>
                                                <h5>Documents demandés :</h5>

                                                <Alert variant="info" className="mt-4">
                                                    Ils sont obligatoires pour enregistrer votre dossier
                                                </Alert>

                                                {claim?.established?.includes('constat') ? <>
                                                    <div className="flex flex-col gap-4 mt-4 relative">
                                                        {hasFile('constat') ? <FontAwesomeIcon icon={faTimes} className="text-red-500 cursor-pointer hover:text-red-800 absolute top-2 right-2" onClick={() => {
                                                            setDocuments({ ...documents, pv: false });
                                                        }} /> : null}
                                                        <div className="flex flex-row justify-between items-center border border-gray-300 rounded-md p-4">
                                                            <span>Constat</span>
                                                            {hasFile('constat') ? <div className={`rounded-full h-6 w-6 bg-green-100 flex items-center justify-center`}>
                                                                <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                                            </div> : <>
                                                                <input name="constat" type="file" onChange={handleFileChange} ref={filesRef.constat} className="hidden" />
                                                                <Button variant="primary" onClick={() => filesRef.constat.current.click()}>
                                                                    Télécharger
                                                                </Button>
                                                            </>}
                                                        </div>
                                                    </div></> : null}

                                                {claim?.established?.includes('pv') ? <>
                                                    <div className="flex flex-col gap-4 mt-4 relative">
                                                        {/* add cross to remove files */}
                                                        {hasFile('pv') ? <FontAwesomeIcon icon={faTimes} className="text-red-500 cursor-pointer hover:text-red-800 absolute top-2 right-2" onClick={() => {
                                                            setDocuments({ ...documents, pv: false });
                                                        }} /> : null}
                                                        <div className="flex flex-row justify-between items-center border border-gray-300 rounded-md p-4">
                                                            <span>Procès verbal</span>
                                                            {hasFile('pv') ? <div className={`rounded-full h-6 w-6 bg-green-100 flex items-center justify-center`}>
                                                                <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                                            </div> : <>
                                                                <input name="pv" type="file" onChange={handleFileChange} ref={filesRef.pv} className="hidden" />
                                                                <Button variant="primary" onClick={() => filesRef.pv.current.click()}>
                                                                    Télécharger
                                                                </Button>
                                                            </>}
                                                        </div>
                                                    </div></> : null}

                                                {!['home', 'mrh', 'habitation'].includes(policy?.product?.type) ? <>
                                                    <div className="flex flex-col gap-4 mt-4 relative">
                                                        {/* add cross to remove files */}
                                                        {hasFile('photos') ? <FontAwesomeIcon icon={faTimes} className="text-red-500 cursor-pointer hover:text-red-800 absolute top-2 right-2" onClick={() => {
                                                            setDocuments({ ...documents, photos: false });
                                                        }} /> : null}
                                                        <div className="flex flex-row justify-between items-center border border-gray-300 rounded-md p-4">
                                                            <span>4 photos du véhicule<br /><strong>avant / arrière / côtés</strong></span>
                                                            {hasFile('photos') ? <div className={`rounded-full h-6 w-6 bg-green-100 flex items-center justify-center`}>
                                                                <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                                            </div> : <>
                                                                <input name="photos" type="file" onChange={handleFileChange} ref={filesRef.photos} className="hidden" multiple={true} />
                                                                <Button variant="primary" onClick={() => filesRef.photos.current.click()}>
                                                                    Télécharger
                                                                </Button>
                                                            </>}
                                                        </div>
                                                    </div> </> : null}

                                                {/* Back and next buttons */}
                                                <div className="grid grid-cols-2 gap-4 mt-8">
                                                    <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                        Précédent
                                                    </Button>

                                                    <Button variant="primary" type="submit" disabled={!canSubmit(currentStep)} >
                                                        Suivant
                                                    </Button>
                                                </div>
                                            </form>
                                        </>
                                        : null}

                                    {currentStep === 7 ?
                                        <>
                                            <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>
                                                <label className="block text-sm font-medium">
                                                    Déclarations complémentaires
                                                </label>

                                                <div className="">
                                                    <label className="block text-sm font-medium">
                                                        Tiers identifié(s) ?
                                                    </label>

                                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                                        <Button variant="choice" onClick={() => {
                                                            setClaim({ ...claim, hasParties: true, parties: [{}] });
                                                        }} isChecked={claim?.hasParties}>
                                                            Oui
                                                        </Button>

                                                        <Button variant="choice" onClick={() => setClaim({ ...claim, hasParties: false })} isChecked={claim?.hasParties === false}>
                                                            Non
                                                        </Button>
                                                    </div>
                                                </div>

                                                {claim?.hasParties ? <div className="mt-4">

                                                    {claim?.hasParties && claim?.parties?.map((party, idx) => {
                                                        return <>
                                                            <h5 className="text-md mt-4 mb-2">
                                                                Tiers {idx + 1}
                                                            </h5>

                                                            <PartyForm key={idx} party={party} onChange={(party) => {
                                                                const parties = claim?.parties ?? [];
                                                                parties[idx] = party;
                                                                setClaim({ ...claim, parties });
                                                            }} />

                                                        </>
                                                    })}

                                                    <div className="mt-4">
                                                        <Button variant="link" onClick={() => {
                                                            const parties = claim?.parties ?? [];
                                                            parties.push({});
                                                            setClaim({ ...claim, parties });
                                                        }} isFullWidth={true}>
                                                            Ajouter un tiers
                                                        </Button>
                                                    </div>

                                                </div> : null}

                                                {/* Back and next buttons */}
                                                <div className="grid grid-cols-2 gap-4 mt-8">
                                                    <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                        Précédent
                                                    </Button>

                                                    <Button variant="primary" type="submit" disabled={!canSubmit(currentStep)}>
                                                        Suivant
                                                    </Button>
                                                </div>
                                            </form>
                                        </>
                                        : null}

                                    {currentStep === 8 ?
                                        <>
                                            <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>
                                                Souhaitez-vous porter d'autres informations à notre connaissance ?

                                                <InputField name={'freeComment'} value={claim.freeComment} type="textarea" placeholder="Commentaire libre" onChange={handleChange} />

                                                <div className="mt-4">
                                                    <label className="block mb-4">
                                                        Autres documents
                                                    </label>

                                                    <FileUploader allowMultiple={true} onChange={(files) => {
                                                        setDocuments({ ...documents, others: files });
                                                    }} />

                                                    {documents.others ? <div className="mt-4 flex flex-col gap-2">

                                                        {(documents?.others ?? []).map((file, idx) => {
                                                            return <div key={idx} className="flex flex-row justify-between items-center border border-gray-300 rounded-md p-4">
                                                                <FontAwesomeIcon icon={faTimes} className="text-red-500 cursor-pointer hover:text-red-800" onClick={() => {
                                                                    setDocuments({ ...documents, others: documents.others.filter((f) => f !== file) });
                                                                }} />
                                                                <span>{file?.name}</span>
                                                                <div className={`rounded-full h-6 w-6 bg-green-100 flex items-center justify-center`}>
                                                                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                                                </div>
                                                            </div>
                                                        })}

                                                    </div> : null}
                                                </div>

                                                {/* Back and next buttons */}
                                                <div className="grid grid-cols-2 gap-4 mt-8">
                                                    <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                        Précédent
                                                    </Button>

                                                    <Button variant="primary" type="submit" disabled={!canSubmit(currentStep)}>
                                                        Suivant
                                                    </Button>
                                                </div>
                                            </form>
                                        </>
                                        : null}

                                    {currentStep === 9 ?
                                        <>
                                            <form className="flex flex-col gap-4" onSubmit={(e) => handleStepSubmit(e, currentStep)}>
                                                <p>
                                                    Une dernière chose, merci de vérifier vos informations de contact avant de finaliser:
                                                </p>

                                                <div className="flex flex-col gap-4 mt-4">
                                                    <InputField value={claim.contactEmail} name="email" label="E-mail" placeholder="E-mail" onChange={handleChange} />
                                                    <InputField value={claim.contactPhone} name="phone" label="Téléphone" placeholder="Téléphone" onChange={handleChange} />
                                                    <InputField value={claim.contactAddress} name="address" label="Adresse" placeholder="Adresse" onChange={handleChange} />
                                                    <InputField value={claim.contactComplementAddress} name="complementAdresss" label="Complément d'adresse" placeholder="Complément d'adresse" onChange={handleChange} />
                                                    <InputField value={claim.contactZipcode} name="zipcode" label="Code postal" placeholder="Code postal" onChange={handleChange} />
                                                    <InputField value={claim.contactCity} name="city" label="Ville" placeholder="Ville" onChange={handleChange} />
                                                </div>

                                                {/* Back and next buttons */}
                                                <div className="grid grid-cols-2 gap-4 mt-8">
                                                    <Button variant="outline_primary" onClick={() => setCurrentStep(currentStep - 1)}>
                                                        Précédent
                                                    </Button>
                                                    <Button variant="primary" type="submit" disabled={!canSubmit(currentStep)} onClick={handleSubmit} >
                                                        Finaliser
                                                    </Button>
                                                </div>
                                            </form>
                                        </>
                                        : null}

                                </>}

                            </>}

                    </div>
                </div>

            </div>
        </Page>
    </>

}