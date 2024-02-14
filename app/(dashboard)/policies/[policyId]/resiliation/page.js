'use client';

import Page from "@/components/Page";
import DesktopTopbar from "@/components/DesktopTopbar";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import InputField from "@/components/InputField";
import { getPolicy } from "@/lib/api/policies";
import { useRouter } from "next/navigation";
import { createTermination } from "@/lib/api/terminations";
import { addTerminationAttachment } from "@/lib/api/terminations";

export default function Resiliation({ params }) {

    const policyId = params.policyId;
    const maxSteps = 10;

    const [reasons, setReasons] = useState([
        { value: 'Je vends mon véhicule', label: 'Je vends mon véhicule', product_type: ['cyclo', 'moto', 'vsp'] },
        { value: 'Je donne mon véhicule', label: 'Je donne mon véhicule', product_type: ['cyclo', 'moto', 'vsp'] },
        { value: 'Je mets mon véhicule à la casse', label: 'Je mets mon véhicule à la casse', product_type: ['cyclo', 'moto', 'vsp'] },
        { value: 'Je change d\'assureur', label: 'Je change d\'assureur', product_type: ['cyclo', 'moto', 'vsp'] },
        { value: 'Je change de véhicule', label: 'Je change de véhicule', product_type: ['cyclo', 'moto', 'vsp'] },
        { value: 'Retraction', label: 'Je me rétracte', product_type: ['cyclo', 'moto', 'vsp'] },
        { value: 'Déménagement', label: 'Je déménage', product_type: ['mrh', 'home', 'habitation'] },
        { value: 'Loi chatel', label: 'Je souhaite résilier dans le cadre de la loi Chatel', product_type: ['mrh', 'home', 'habitation'] },
        { value: 'À Échéance', label: 'Je souhaite résilier à l\'échéance', product_type: ['mrh', 'home', 'habitation'] },
    ]);

    const hasFile = (name) => {
        return documents[name] !== undefined;
    }

    const router = useRouter();

    const [documents, setDocuments] = useState({});
    const [step, setStep] = useState(1);
    const [termination, setTermination] = useState({});
    const [policy, setPolicy] = useState({});
    const [policyLoading, setPolicyLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const filesRef = {
        grey_card: useRef(null),
        certificate_of_transfer: useRef(null),
    };

    const handleFileChange = (e) => {

        const name = e.target.name;
        const file = e.target.files[0];

        // if file is not an imae of a pdf return
        if (!file.type.includes('image') && !file.type.includes('pdf')) {
            return alert('Le fichier doit être une image ou un PDF');
        }

        setDocuments({ ...documents, [name]: file });
    }

    const handleChange = (e) => {
        let { id, name, value } = e.target;

        setTermination({ ...termination, [name]: value });
    }

    const nextStep = () => {
        setStep(step + 1);
    }

    const loadPolicy = async () => {
        try {
            const policy = await getPolicy(policyId);
            setPolicy(policy);
            setPolicyLoading(false);
        } catch (e) {
            console.log(e);
        } finally {
            setPolicyLoading(false);
        }
    }

    const askForTermination = async () => {
        try {
            setIsSending(true);
            const response = await createTermination(policyId, termination, "", false);
            console.log(response);

            for (let key in documents) {
                const file = documents[key];
                const terminationId = response?.data?.data?.id;
                const attachment = await addTerminationAttachment(terminationId, file);
            }

            nextStep();
        } catch (e) {
            console.log(e);
            alert('Erreur lors de la résiliation, veuillez nous contacter à contact@klian.fr');
        } finally {
            setIsSending(false);
        }
    }

    useEffect(() => {
        loadPolicy();
    }, []);

    useEffect(() => {

        if (!policy) {
            return;
        }

        setReasons(reasons.filter((reason) => {
            if (reason.product_type) {
                return reason.product_type.includes(policy.product?.type);
            }

            return true;
        }));

    }, [policy]);

    if (policyLoading) {
        return <>Chargement...</>
    }

    return <>
        <Page>
            <DesktopTopbar breadcrumbs={[
                { name: 'Contrats', href: '/policies' },
                { name: 'Contrat n°' + policyId, href: '/policies/' + policyId },
                { name: 'Résiliation', href: '/policies/' + policyId + '/resiliation' },
            ]} />

            <div className="w-full">

                <h2 className="text-3xl font-bold">
                    Résiliation
                </h2>

                <p className="mt-4 mb-10">
                    Nous sommes tristes de vous voir partir 😢
                </p>

                {step === 1 ? <>

                    <div className="flex flex-col gap-4 mt-4 relative">
                        N° de contrat : {policyId}
                    </div>

                    <div className="flex flex-col gap-4 mt-4 relative">
                        <InputField
                            label={`Nom`}
                            name="lastname"
                            placeholder="Nom"
                            type="text"
                            required
                            onChange={handleChange}
                        />

                        <InputField
                            label={`Prénom`}
                            name="firstname"
                            placeholder="Prénom"
                            type="text"
                            required
                            onChange={handleChange}
                        />

                        <InputField
                            label={`Email`}
                            name="email"
                            placeholder="E-mail"
                            type="email"
                            required
                            onChange={handleChange}
                        />

                        <InputField
                            label={`Numéro de contrat`}
                            name="policyId"
                            placeholder="Numéro de contrat"
                            type="text"
                            required
                            onChange={handleChange}
                        />

                        <InputField
                            choices={reasons}
                            label={`Motif de résiliation`}
                            name="reason"
                            placeholder="Motif de résiliation"
                            type="select"
                            required
                            onChange={handleChange}
                        />
                    </div>

                </> : null}

                {step === 2 ? <>

                    <p className="mt-8">
                        Justificatifs demandés :
                    </p>

                    <div className="bg-mint-light rounded-lg p-4 mt-4">
                        Ils sont obligatoires pour enregistrer votre résiliation.
                    </div>

                    <div className="flex flex-col gap-4 mt-4 relative">
                        {hasFile('certificate_of_transfer') ? <FontAwesomeIcon icon={faTimes} className="text-red-500 cursor-pointer hover:text-red-800 absolute top-2 right-2" onClick={() => {
                            setDocuments({ ...documents, pv: false });
                        }} /> : null}
                        <div className="flex flex-row justify-between items-center border border-gray-300 rounded-md p-4">
                            <span>
                                Certificat de cession
                            </span>
                            {hasFile('certificate_of_transfer') ? <div className={`rounded-full h-6 w-6 bg-green-100 flex items-center justify-center`}>
                                <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                            </div> : <>
                                <input name="certificate_of_transfer" type="file" onChange={handleFileChange} ref={filesRef.certificate_of_transfer} className="hidden" />
                                <Button variant="primary" onClick={() => filesRef.certificate_of_transfer.current.click()}>
                                    Télécharger
                                </Button>
                            </>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-4 relative">
                        {hasFile('grey_card') ? <FontAwesomeIcon icon={faTimes} className="text-red-500 cursor-pointer hover:text-red-800 absolute top-2 right-2" onClick={() => {
                            setDocuments({ ...documents, pv: false });
                        }} /> : null}
                        <div className="flex flex-row justify-between items-center border border-gray-300 rounded-md p-4">
                            <span>
                                Carte grise barée ou certificat de cession
                            </span>
                            {hasFile('grey_card') ? <div className={`rounded-full h-6 w-6 bg-green-100 flex items-center justify-center`}>
                                <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                            </div> : <>
                                <input name="grey_card" type="file" onChange={handleFileChange} ref={filesRef.grey_card} className="hidden" />
                                <Button variant="primary" onClick={() => filesRef.grey_card.current.click()}>
                                    Télécharger
                                </Button>
                            </>}
                        </div>
                    </div>
                </> : null}

                {step === 3 ? <>
                    <>
                        <p className="font-medium mb-6">
                            Récapitulatif de votre demande
                        </p>

                        <p className="text-gray-400">
                            Vous souhaitez résilier le contrat :
                        </p>

                        <p className="text-blue-default font-bold mt-2">
                            N° {policyId}
                        </p>

                        <p className="text-gray-400 mt-4 mb-4">
                            Pour le motif suivant :
                        </p>

                        <p className="text-blue-default font-bold mb-6">
                            {termination?.reason}
                        </p>

                        <p className="text-gray-400">
                            Information de contact :
                        </p>

                        <p className="text-blue-default font-bold mt-2">
                            {termination?.lastname} {termination?.firstname} <br />
                            {termination?.email}
                        </p>

                    </>
                </> : null}

                {step === 4 ? <>
                    <div className="mx-auto flex flex-col items-start gap-4 text-center">

                        <div className="mb-8 mx-auto">
                            <svg width="144" height="75" viewBox="0 0 144 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_3148_59441)">
                                    <path d="M120.032 73.3072H39.5414V73.2714H120.032C121.829 73.2714 123.734 72.5796 125.387 71.3153L101.392 41.9491L101.428 41.9252L125.423 71.2914C127.148 69.9674 128.382 68.2021 128.885 66.3175L142.015 17.5329C142.518 15.6364 142.242 13.8711 141.224 12.5471C140.254 11.2827 138.72 10.5909 136.911 10.5909H63.4166C59.5712 10.5909 55.594 13.716 54.5637 17.5448L50.2152 33.707H50.1792L54.5278 17.5448C55.57 13.6921 59.5592 10.5671 63.4166 10.5671H136.911C138.732 10.5671 140.277 11.2708 141.26 12.5351C142.29 13.8711 142.578 15.6483 142.062 17.5567L128.933 66.3414C128.43 68.226 127.184 70.0032 125.459 71.3391H125.447C125.447 71.3391 125.447 71.3511 125.447 71.363C123.782 72.6273 121.877 73.3311 120.068 73.3311L120.032 73.3072Z" stroke="#00196C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M39.5533 73.3072L39.5294 73.2714L82.0328 41.9133L82.0448 41.9371L39.5533 73.3072Z" stroke="#00196C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M95.0906 46.589L141.236 12.5471C140.301 11.3304 138.792 10.5671 136.911 10.5671H63.4166C61.5358 10.5671 59.6191 11.3304 58.0258 12.5471L85.8423 46.589C87.8669 48.903 91.8202 48.903 95.0906 46.589Z" stroke="#00196C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M34.8693 63.3714H19.5954V63.4072H34.8693V63.3714Z" stroke="#00196C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M39.9726 53.4713H32.3297V53.5071H39.9726V53.4713Z" stroke="#00196C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M45.0759 43.5712H14.552V43.607H45.0759V43.5712Z" stroke="#00196C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M50.1912 33.6712H34.9172V33.707H50.1912V33.6712Z" stroke="#00196C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M18.4094 3.25532L19.9787 1.69278" stroke="#BFDBF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M13.2343 8.51547L14.7916 6.95293" stroke="#BFDBF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M14.7437 3.30303L13.1863 1.74049" stroke="#BFDBF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20.0267 8.45583L18.4573 6.90522" stroke="#BFDBF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M15.8099 28.5542C18.5293 29.5084 20.6976 31.6435 21.7038 34.3391C21.9075 34.8878 22.6622 34.8878 22.8539 34.3391C23.8122 31.6315 25.9566 29.4726 28.664 28.4707C29.215 28.2679 29.215 27.5164 28.664 27.3256C25.9446 26.3714 23.7763 24.2363 22.77 21.5406C22.5664 20.9919 21.8117 20.9919 21.62 21.5406C20.6616 24.2482 18.5173 26.4072 15.8099 27.4091C15.2588 27.6119 15.2588 28.3633 15.8099 28.5542Z" fill="white" stroke="#5EFFC3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3.19538 20.9084C4.0224 20.9084 4.69283 20.2409 4.69283 19.4175C4.69283 18.594 4.0224 17.9265 3.19538 17.9265C2.36837 17.9265 1.69794 18.594 1.69794 19.4175C1.69794 20.2409 2.36837 20.9084 3.19538 20.9084Z" stroke="#F63463" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3148_59441">
                                        <rect width="143" height="74" fill="white" transform="translate(0.5 0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        <p>Votre demande a bien été enregistrée auprès de nos services.<br />
                            Nous reviendrons vers vous par email dans les meilleurs délais.</p>
                    </div>
                </>
                    : null}

                {step == 3 ? <>
                    <div className="flex flex-row justify-start mt-8">
                        <Button variant="primary" size="lg" onClick={() => askForTermination()} isFullWidth={true}>
                            Demander la résiliation
                            {isSending ? <FontAwesomeIcon icon={faSpinner} className="animate-spin ml-2" /> : null}
                        </Button>
                    </div>
                </> : <>

                    {step != 4 ? <>
                        <div className="flex flex-row justify-between mt-8">
                            {step > 1 ? <Button variant="outline_primary" size="lg">
                                Précédent
                            </Button> : null}

                            {step < maxSteps ? <Button variant="primary" size="lg" onClick={nextStep}>
                                Suivant
                            </Button> : null}
                        </div>
                    </> : <>
                        <div className="flex flex-row justify-start mt-8">
                            <Button variant="primary" size="lg" onClick={() => router.push('/policies/' + policyId)} isFullWidth={true}>
                                Retour à mon contrat
                            </Button>
                        </div>

                    </>}

                </>}



            </div>
        </Page>

    </>

}