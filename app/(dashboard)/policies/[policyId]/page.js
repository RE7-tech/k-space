'use client';

import DesktopLayout from "@/components/DesktopLayout";
import DesktopTopbar from "@/components/DesktopTopbar";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import {formatEuro, formatLicensePlate, ucfirst, formatDate} from "@/utils/format";
import {
    faBan,
    faCalendar,
    faChevronRight,
    faDotCircle,
    faEllipsisVertical,
    faExclamationTriangle,
    faExplosion,
    faFileContract,
    faHandDots,
    faListDots,
    faMoneyBill,
    faNewspaper,
    faPaperPlane,
    faShield,
    faWarning
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Alert from "@/components/Alert";
import Card from "@/components/Card";
import {useRouter} from "next/navigation";
import usePolicy from "@/hooks/usePolicy";
import Loader from "@/components/Loader";
import {useViewport} from "react-viewport-hooks";
import config from "@/utils/config";
import {productIcons} from "@/utils/products";
import Image from "next/image";
import {useState} from "react";

export default function Policy({params}) {

    const policyId = params.policyId;
    const router = useRouter();
    const {policy, isLoading, isError} = usePolicy(policyId);
    const {vw, vh} = useViewport();
    const [showMenu, setShowMenu] = useState(false);

    const quickLinks = [
        {
            icon: faFileContract,
            name: 'Contrat, attestation...',
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
                <Loader/>
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

    const hasPendingTermination = () => {
        if (!policy?.terminations) return false;

        return policy?.terminations?.find(termination => ['pending', 'processing'].includes(termination?.status?.toLowerCase())) ?? false;
    }

    const hasDeclinedTermination = () => {
        if (!policy?.terminations) return false;

        return policy?.terminations?.find(termination => termination?.status?.toLowerCase() === 'declined') ?? false;
    }

    const getLastTerminationDeclined = () => {
        if (!policy?.terminations) return false;

        return policy?.terminations?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))?.find(termination => termination?.status?.toLowerCase() === 'declined') ?? false;
    }

    const getPolicyBalance = () => {
        if (!policy?.balance) return 0;

        return parseFloat(policy?.balance ?? 0);
    }

    const isSignatureMissing = () => {
        return policy?.is_signed === false;
    }

    return <>
        <Page>

            <DesktopTopbar breadcrumbs={[
                {name: 'Contrats', href: '/policies'},
                {name: 'Mon contrat', href: '/policies/' + policyId},
            ]}/>

            {policy?.status?.toLowerCase() !== "pending" ? <>

                {(policy.is_unpaid ?? false) ? <Alert variant="danger">
                    Le paiement de votre assurance n'a pas pu être effectué. Veuillez mettre à jour votre moyen de
                    paiement.
                </Alert> : null}

                {hasPendingTermination() ? <Alert variant="info">
                    <FontAwesomeIcon icon={faWarning} width={24} height={24} className="me-4"/>
                    Demande de résiliation en cours
                </Alert> : null}

                <div className="flex flex-col gap-4">
                    {hasDeclinedTermination() ? <Alert variant="danger">
                        <div className="flex flex-col items-start gap-4">
                            <p>
                                <FontAwesomeIcon icon={faWarning} width={24} height={24} className="me-4"/>
                                Votre demande de résiliation a été refusée.
                            </p>
                            {getLastTerminationDeclined()?.customer_comment ? <p className="text-gray-500 text-sm">
                                {getLastTerminationDeclined()?.customer_comment}
                            </p> : null}
                        </div>
                    </Alert> : null}

                    {getPolicyBalance() < -5 ? <Alert variant="warning" clickable={true} onClick={() => {
                        router.push('/regulariser/' + policyId);
                    }}>
                        <div className={'flex flex-col gap-1'}>
                            <div className="flex  items-start items-center text-lg font-semibold">
                                <FontAwesomeIcon icon={faExclamationTriangle} width={24} height={24} className="me-4"/>
                                Paiement en attente
                            </div>
                            <p>
                                Vous avez un paiement en attente ({Math.abs(getPolicyBalance()).toFixed(2)}€). Cliquez
                                ici pour régulariser votre
                                situation <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className=""/>
                            </p>
                        </div>
                    </Alert> : null}

                    {isSignatureMissing() ? <Alert variant="warning" clickable={true} onClick={() => {
                            router.push(`${config.app.subscriptionUrl}/etapes/contrats/${policy?.id}/signature`);
                        }}>
                            <div className={'flex flex-col gap-1'}>
                                <div className="flex  items-start items-center text-lg font-semibold">
                                    <FontAwesomeIcon icon={faExclamationTriangle} width={24} height={24} className="me-4"/>
                                    Signature en attente
                                </div>
                                <p>
                                    Vous n'avez pas encore signé votre contrat. Cliquez ici pour le signer
                                    <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className=""/>
                                </p>
                            </div>
                        </Alert>
                        : null}
                </div>

                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-[22px] font-bold mt-8 mb-8 font-poppins">
                        {policy?.summary?.primary} - {policy?.summary?.secondary}
                    </h1>

                    {(!policy.has_termination ?? true) ? <>
                        <div>
                            <div className="relative w-full">
                                <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-400 cursor-pointer"
                                                 width={24} height={24} onClick={() => {
                                    // open menu
                                    setShowMenu(!showMenu);
                                }}/>

                                {showMenu ? <div
                                    className="absolute top-8 right-0 bg-white shadow-lg rounded-lg p-4 w-[250px] z-50">
                                    <div className="flex flex-col gap-2 w-full">

                                        <div
                                            className="flex flex-row items-center gap-2 cursor-pointer hover:text-gray-800"
                                            onClick={() => {
                                                router.push('/policies/' + policyId + '/resiliation');
                                            }}>
                                            <FontAwesomeIcon icon={faBan} width={24} height={24}
                                                             className="text-pink-500"/>
                                            <span>
                                                Résilier mon contrat
                                            </span>
                                        </div>
                                    </div>
                                </div> : null}
                            </div>
                        </div>
                    </> : null}
                </div>

                {/* Two columns in desktop mode, and one column in mobile mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card sizeMode={`adaptive`} className="w-full">

                        <div className="flex flex-col justify-center items-center gap-1 w-full">
                            <img src={productIcons[policy?.product?.type]?.src} width={64} height={64} className="mb-4"
                                 alt="" priority/>

                            <h3 className="text-xl font-bold font-poppins font-semibold">
                                {policy?.summary?.primary}
                            </h3>
                            <p className="text-gray-500 text-lg">
                                {policy?.summary?.secondary}
                            </p>
                            <div className="flex flex-row justify-around w-full gap-2 mt-6">

                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="rounded-full border-2 border-blue-800 p-4 w-[38px] h-[38px] flex items-center justify-center bg-gray-100">
                                        <FontAwesomeIcon icon={faShield} width={32} height={32}
                                                         className="text-blue-800"/>
                                    </div>
                                    <div className="text-md text-blue-default font-semibold opacity-60">
                                        {ucfirst(policy?.formula?.name ?? '...')}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="rounded-full border-2 border-blue-800 p-4 w-[38px] h-[38px] flex items-center justify-center bg-gray-100">
                                        <FontAwesomeIcon icon={faMoneyBill} width={32} height={32}
                                                         className="text-blue-800"/>
                                    </div>
                                    <div className="text-md text-blue-default font-semibold opacity-60">
                                        {formatEuro(policy?.total_premium ?? 0)}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="rounded-full border-2 border-blue-800 p-4 w-[38px] h-[38px] flex items-center justify-center bg-gray-100">
                                        <FontAwesomeIcon icon={faCalendar} width={32} height={32}
                                                         className="text-blue-800"/>
                                    </div>
                                    <div className="text-md text-blue-default font-semibold opacity-60">
                                        {formatDate(policy?.start_date)}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* <div className="mt-8 text-center">
                            <a href="#" className="text-gray-500 underline underline-offset-[3px]">
                                Qu'est-ce qui est couvert par mon contrat ?
                            </a>
                        </div> */}


                    </Card>

                    <div className="flex flex-col gap-8 items-start justify-start w-full p-4 flex-1">
                        {(quickLinks ?? []).map((quickLink, idx) => {
                            return <div onClick={() => handleQuickLinkClick(quickLink)} key={idx}
                                        className={`pb-5 w-full flex items-center gap-2 justify-between text-2xl ${idx === quickLinks.length - 1 ? '' : 'border-b-2  border-gray-200'} hover:opacity-80 cursor-pointer`}>
                                <div className="text-lg flex justify-center items-center gap-4 font-medium">
                                    <FontAwesomeIcon icon={quickLink.icon} width={32} height={32} className=""/>
                                    <span>
                                        {quickLink.name}
                                    </span>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} width={18} height={18}
                                                 className="text-gray-400"/>
                            </div>
                        })}
                    </div>
                </div>

            </> : <Alert variant="warning" clickable={true} onClick={() => {
                router.push(`${config.app.subscriptionUrl}/recapitulatif/${policy?.quote_id}`);
            }}>
                <div className="flex items-center gap-1">
                    Vous n'avez pas terminé la souscription de votre contrat. Cliquez ici pour la
                    finaliser. <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className=""/>
                </div>
            </Alert>}


        </Page>
    </>
}