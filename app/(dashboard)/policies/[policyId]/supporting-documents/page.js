'use client';

import Highlight from "@/components/Highlight";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import { faEye, faInfoCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import ThreeStarsIcon from "@/public/misc/threestars.svg";
import DesktopTopbar from "@/components/DesktopTopbar";
import Card from "@/components/Card";
import SupportingDocumentListItem from "@/components/SupportingDocumentListItem";
import usePolicySupportingDocuments from "@/hooks/usePolicySupportingDocuments";
import { useState } from "react";
import SupportingDocumentModal from "@/components/SupportingDocumentModal";
import SupportingDocumentViewerModal from "@/components/SupportingDocumentViewerModal";
import usePolicy from "@/hooks/usePolicy";

export function SupportingDocumentsCategory({ category, onItemClick }) {

    const supportingDocuments = (category.supporting_documents ?? []);

    const handleItemClick = (sd) => {
        onItemClick(sd, category);
    };

    const countValidated = supportingDocuments.filter(sd => ['validated', 'accepted', 'pending'].includes(sd?.status?.toLowerCase())).length;

    return <>
        <Card header={<>
            <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{category?.label ?? '...'}</span>
                <span>
                    ({countValidated} / {supportingDocuments.length})
                </span>
            </div>
        </>}>
            <div className="flex flex-col gap-4">
                {supportingDocuments.map((sd, idx) => {
                    return <SupportingDocumentListItem key={idx} supportingDocument={sd} hasBorderBottom={idx < supportingDocuments.length - 1} onClick={() => handleItemClick(sd)} />
                })}
            </div>
        </Card>
    </>
}

export default function SupportingDocuments({ params }) {

    const policyId = params?.policyId;

    const { policy, loading: policyLoading, error: policyError } = usePolicy(params?.policyId);

    const [openSupportingDocumentModal, setOpenSupportingDocumentModal] = useState(false);
    const [openSupportingDocumentViewer, setOpenSupportingDocumentViewer] = useState(false);

    const { policySupportingDocuments, loading, error, mutate } = usePolicySupportingDocuments(params?.policyId);

    const handleItemClick = (sd, category) => {
        console.log('sd', sd);
        console.log('category', category);

        if (['validated', 'accepted', 'pending'].includes(sd?.status?.toLowerCase())) {
            setOpenSupportingDocumentViewer(sd);
        } else {
            setOpenSupportingDocumentModal(sd);
        }
    };

    const isAllSupportingDocumentsAreSendedOrValidated = () => {
        return Object.values(policySupportingDocuments ?? {}).every(category => {
            return category?.supporting_documents?.every(sd => {
                return ['validated', 'accepted', 'pending'].includes(sd?.status?.toLowerCase());
            });
        });
    }

    const handleSupportingDocumentStatesChange = (sd) => {
        mutate();
    }

    return <>
        <Page>

            {openSupportingDocumentModal !== false ? <>
                <SupportingDocumentModal policy={policy} onClose={() => setOpenSupportingDocumentModal(false)} supportingDocument={openSupportingDocumentModal} onChange={handleSupportingDocumentStatesChange} />
            </> : null}

            {openSupportingDocumentViewer !== false ? <>
                <SupportingDocumentViewerModal policy={policy} supportingDocument={openSupportingDocumentViewer} onClose={() => setOpenSupportingDocumentViewer(false)} />
            </> : null}

            <DesktopTopbar breadcrumbs={[
                { name: 'Mes contrats', href: '/policies' },
                { name: 'Mon contrat', href: '/policies/' + policyId },
                { name: 'Mes justificatifs', href: '/policies/' + policyId + '/supporting-documents' },
            ]} />

            <div className="flex flex-row justify-between items-center mt-8">

                <PageTitle subtitleClassName={`text-sm font-normal`} subtitle={<>
                    {isAllSupportingDocumentsAreSendedOrValidated() ? <>
                        Votre dossier est complet. BRAVO ! </> : <>
                        Votre dossier n'est pas complet. Vous devez encore envoyer des justificatifs.
                    </>}
                </>}>
                    Mes <Highlight>justificatifs</Highlight> <FontAwesomeIcon icon={faInfoCircle} width={18} height={18} className="text-gray-400" />
                </PageTitle>

                <div className="rounded-full border-2 border-gray-300 p-2">
                    <Image src={ThreeStarsIcon} alt="" width={96} height={9} />
                </div>

            </div>

            <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {loading ? <>
                        <div className="flex items-center justify-center">
                            <FontAwesomeIcon icon={faSpinner} size="2x" className="text-gray-400" />
                            <p>
                                Chargement, veuillez patienter...
                            </p>
                        </div>
                    </> : null}

                    {(Object.entries(policySupportingDocuments ?? {}))?.map(([key, category], idx) => {
                        console.log('category', category);
                        return <SupportingDocumentsCategory key={idx} category={category} onItemClick={handleItemClick} />
                    })}

                </div>
            </div>
        </Page>
    </>
}