'use client';

import Page from "@/components/Page";
import DesktopTopbar from "@/components/DesktopTopbar";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import InputField from "@/components/InputField";
import { getPolicy } from "@/lib/api/policies";

export default function Resiliation({ params }) {

    const policyId = params.policyId;
    const maxSteps = 10;

    const hasFile = (name) => {
        return documents[name] !== undefined;
    }

    const [documents, setDocuments] = useState({});
    const [step, setStep] = useState(1);
    const [termination, setTermination] = useState({});
    const [policy, setPolicy] = useState({});
    const [policyLoading, setPolicyLoading] = useState(true);

    const filesRef = {
        grey_card: useRef(null),
        certificate_of_transfer: useRef(null),
    };

    const handleFileChange = (e) => {
        const name = e.target.name;
        const file = e.target.files[0];
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

    useEffect(() => {
        loadPolicy();
    }, []);

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
                            name="name"
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
                            label={`Numéro de contrat`}
                            name="policyId"
                            placeholder="Numéro de contrat"
                            type="text"
                            required
                            onChange={handleChange}
                        />

                        <InputField
                            choices={[
                                { value: '1', label: 'Je vends mon véhicule' },
                                { value: '2', label: 'Je donne mon véhicule' },
                                { value: '3', label: 'Je mets mon véhicule à la casse' },
                                { value: '4', label: 'Je change d\'assureur' },
                                { value: '5', label: 'Je change de véhicule' },
                                { value: '6', label: 'Autre' },
                            ]}
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

                        <p className="text-blue-default font-bold">
                            N° {policyId} - {policy?.summary?.main}
                        </p>

                        <p className="text-gray-400">
                            Pour le motif suivant :
                        </p>

                        <p className="text-blue-default font-bold mb-6">
                            {termination?.reason ?? "Non renseigné"}
                        </p>

                        <p className="text-gray-400">
                            Information de contact :
                        </p>

                        <p className="text-blue-default font-bold">
                            {termination?.lastname} {termination?.firstname} <br/>
                            {termination?.email}
                        </p>

                    </>
                </> : null}

                <div className="flex flex-row justify-between mt-8">
                    {step > 0 ? <Button variant="outline_primary" size="lg">
                        Précédent
                    </Button> : null}

                    {step < maxSteps ? <Button variant="primary" size="lg" onClick={nextStep}>
                        Suivant
                    </Button> : null}
                </div>

            </div>
        </Page>

    </>

}