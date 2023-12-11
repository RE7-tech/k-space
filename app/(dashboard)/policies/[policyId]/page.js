'use client';

import DesktopLayout from "@/components/DesktopLayout";
import DesktopTopbar from "@/components/DesktopTopbar";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import { formatEuro, formatLicensePlate, ucfirst, formatDate } from "@/utils/format";
import { faCalendar, faChevronRight, faExplosion, faFileContract, faListDots, faMoneyBill, faNewspaper, faPaperPlane, faShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "@/components/Alert";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import usePolicy from "@/hooks/usePolicy";
import Loader from "@/components/Loader";
import { useViewport } from "react-viewport-hooks";
import config from "@/utils/config";
import { productIcons } from "@/utils/products";
import Image from "next/image";

export default function Policy({ params }) {

    const policyId = params.policyId;

    const router = useRouter();

    const { policy, isLoading, isError } = usePolicy(policyId);

    const { vw, vh } = useViewport();

    const quickLinks = [
        {
            icon: faFileContract,
            name: 'Contrat, attestation',
            href: '/policies/' + policyId + '/documents'
        },
        {
            icon: faNewspaper,
            name: 'Mes justificatifs',
            href: `/policies/${policyId}/supporting-documents`
        },
        {
            icon: faExplosion,
            name: 'Sinistres',
            href: `/policies/${policyId}/claims`
        },
    ];

    const handleQuickLinkClick = (quickLink) => {
        return router.push(quickLink.href);
    }

    const getNextPaymentDate = (policy) => {
        switch (policy?.payment_interval ?? '') {
            case 'monthly':
                // add 1 month and take the first day of the month
                return formatDate(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(1));
            case 'yearly':
                // add 1 year and take the first day of the month
                return formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).setDate(1));
            default:
                return '...';
        }
    }

    if (isLoading) {
        return <>
            <Page>
                <Loader />
            </Page>
        </>;
    }

    if (isError) {
        return <>
            <Page>
                <Alert variant="danger">
                    Une erreur est survenue
                </Alert>
            </Page>
        </>;
    }

    return <>
        <Page>

            <DesktopTopbar breadcrumbs={[
                { name: 'Contrats', href: '/policies' },
                { name: 'Mon contrat', href: '/policies/' + policyId },
            ]} />


            {(policy.is_unpaid ?? false) ? <Alert variant="danger">
                Le paiement de votre assurance n'a pas pu être effectué. Veuillez mettre à jour votre moyen de paiement.
            </Alert> : null}

            {/* Two columns in desktop mode, and one column in mobile mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card sizeMode={`adaptive`} className="w-full">

                    <div className="flex flex-col justify-center items-center gap-1 w-full">
                        <Image src={productIcons[policy?.product?.type]} width={64} height={64} className="mb-4" alt="product icon" />
                        <h3 className="text-2xl font-bold">
                            {ucfirst(policy?.fields?.brand ?? '...')} - {ucfirst(policy?.fields?.model ?? '...')}
                        </h3>
                        <p className="text-gray-500 text-xl">
                            {formatLicensePlate(policy?.fields?.license_plate ?? '...')}
                        </p>
                        <div className="flex flex-row justify-around w-full gap-2 mt-6">

                            <div className="flex flex-col items-center gap-2">
                                <div className="rounded-full border-2 border-blue-800 p-4 w-[38px] h-[38px] flex items-center justify-center bg-gray-200">
                                    <FontAwesomeIcon icon={faShield} width={32} height={32} className="text-blue-800" />
                                </div>
                                <div className="text-gray-500 text-md">
                                    {ucfirst(policy?.formula?.name ?? '...')}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="rounded-full border-2 border-blue-800 p-4 w-[38px] h-[38px] flex items-center justify-center bg-gray-200">
                                    <FontAwesomeIcon icon={faMoneyBill} width={32} height={32} className="text-blue-800" />
                                </div>
                                <div className="text-gray-500 text-md">
                                    {formatEuro(policy?.total_premium ?? 0)}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="rounded-full border-2 border-blue-800 p-4 w-[38px] h-[38px] flex items-center justify-center bg-gray-200">
                                    <FontAwesomeIcon icon={faCalendar} width={32} height={32} className="text-blue-800" />
                                </div>
                                <div className="text-gray-500 text-md">
                                    {getNextPaymentDate(policy)}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <a href="#" className="text-gray-500 underline underline-offset-[3px]">
                            Qu'est-ce qui est couvert par mon contrat ?
                        </a>
                    </div>


                </Card>

                <div className="flex flex-col gap-8 items-start justify-start w-full p-4 flex-1">
                    {(quickLinks ?? []).map((quickLink, idx) => {
                        return <div onClick={() => handleQuickLinkClick(quickLink)} key={idx} className={`pb-4 w-full flex items-center gap-2 justify-between text-2xl ${idx === quickLinks.length - 1 ? '' : 'border-b  border-gray-200'} hover:opacity-80 cursor-pointer`}>
                            <div className="text-xl flex justify-center items-center gap-4">
                                <FontAwesomeIcon icon={quickLink.icon} width={32} height={32} className="" />
                                <span>
                                    {quickLink.name}
                                </span>
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className="text-gray-400" />
                        </div>
                    })}
                </div>
            </div>


        </Page>
    </>
}