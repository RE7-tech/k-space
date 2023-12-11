'use client';

import DesktopTopbar from "@/components/DesktopTopbar";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import Card from "@/components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFileContract } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Badge from "@/components/Badge";
import Image from "next/image";
import CertificationsDoc from "@/public/misc/certification.svg";
import usePolicyDocuments from "@/hooks/usePolicyDocuments";
import { useEffect, useState } from "react";
import download from "downloadjs";
import { downloadDocument } from "@/lib/api/documents";

export function DocumentListItem({ document, onClick }) {
    return <>
        <div className="flex items-center justify-between py-4 text-lg rounded-md items-center justify-between hover:bg-gray-100 cursor-pointer hover:p-4" onClick={() => onClick(document)}>
            <span>{document?.name ?? "..."}</span>
            <div className="flex items-center gap-4">
                {document?.status && <Badge variant="success" className="text-white">{document?.status ?? "..."}</Badge>}
                <FontAwesomeIcon icon={faDownload} width={18} height={18} />
            </div>
        </div>
    </>
}

export default function Documents({ params }) {

    const router = useRouter();

    const policyId = params?.policyId;

    const { policyDocuments, loading, error } = usePolicyDocuments(params?.policyId);

    const [categorizedDocuments, setCategorizedDocuments] = useState({});

    const getCategorizedDocuments = () => {
        const documents = {
            'certifications': [],
            'contractual': [],
        };

        (policyDocuments ?? []).forEach(document => {
            if (document?.type === 'certification') {
                documents.certifications.push(document);
            } else {
                documents.contractual.push(document);
            }
        });

        return documents;
    }

    const handleDocumentClick = async (document) => {
        try {
            const { data } = await downloadDocument(document?.id);
            download(data, document?.name, document?.mime_type);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setCategorizedDocuments(getCategorizedDocuments());
    }, [policyDocuments, getCategorizedDocuments]);

    return <>
        <Page>
            <DesktopTopbar breadcrumbs={[
                { name: 'Contrats', href: '/policies' },
            ]} />

            <div className="w-full">

                <div className="flex items-start gap-2 justify-between mb-8">

                    <PageTitle subtitle={<>Retrouvez et téléchargez vos documents contractuels et attestations en un clic !</>} subtitleClassName={'text-lg font-normal opacity-80'}>
                        <div className="flex items-center gap-2 w-full justify-between">
                            <span className="text-2xl font-bold">
                                Contrats, attestation...
                            </span>

                            <Image src={CertificationsDoc} alt="" width={74} height={88} />
                        </div>
                    </PageTitle>

                
                </div>

                {/* Two columns in desktop mode, and one column in mobile mode */}
                <div className="flex flex-col gap-8 md:flex-row md:gap-8 w-full">

                    <Card sizeMode={`adaptive`} header={<>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center justify-center">
                                <FontAwesomeIcon icon={faFileContract} width={18} height={18} />
                                <span className="ml-2 text-lg font-bold">Attestation(s)</span>
                            </div>
                            <span className="ml-2 text-gray-400">({categorizedDocuments?.certifications?.length ?? 0})</span>
                        </div>
                    </>} className={'w-full'}>
                        <div className="flex flex-col gap-2 mt-4">
                            {(categorizedDocuments?.certifications ?? []).length === 0 && <div className="text-gray-400 text-center">Aucun document disponible</div>}
                            {(categorizedDocuments?.certifications ?? []).map((document, idx) => <DocumentListItem key={idx} document={document} onClick={() => handleDocumentClick(document)} />)}
                        </div>
                    </Card>

                    <Card sizeMode={`adaptive`} header={<>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center justify-center">
                                <FontAwesomeIcon icon={faFileContract} width={18} height={18} />
                                <span className="ml-2 text-lg font-bold">Documents contractuels</span>
                            </div>
                            <span className="ml-2 text-gray-400">({categorizedDocuments?.contractual?.length ?? 0})</span>
                        </div>
                    </>} className={'w-full'}>
                        <div className="flex flex-col gap-2 mt-4">
                            {(categorizedDocuments?.contractual ?? []).length === 0 && <div className="text-gray-400 text-center">Aucun document disponible</div>}
                            {(categorizedDocuments?.contractual ?? []).map((document, idx) => <DocumentListItem key={idx} document={document} onClick={() => handleDocumentClick(document)} />)}
                        </div>
                    </Card>

                </div>

            </div>
        </Page>
    </>
}