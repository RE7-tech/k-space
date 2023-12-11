'use client';

import Accordeon from "@/components/Accordeon";
import Badge from "@/components/Badge";
import DesktopTopbar from "@/components/DesktopTopbar";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import { faExplosion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import useClaim from "@/hooks/useClaim";
import { formatDate, ucfirst } from "@/utils/format";

export default function Claim({ params }) {
    const claimId = params.claimId;

    const { claim } = useClaim(claimId);

    const attachments = claim?.attachments ?? [];

    const downloadAttachment = (attachment) => {
        
    }

    return <>
        <Page>

            <DesktopTopbar breadcrumbs={[
                { name: 'Contrats', href: '/policies' },
                { name: 'Mon contrat', href: '/policies/' + claim?.policy?.id },
                { name: 'Sinistres', href: '/policies/' + claim?.policy?.id + '/claims' },
                { name: 'N°' + claim?.id, href: '/policies/' + claim?.policy?.id + '/claims/' + claim?.id },
            ]} />     
            
            <div className="">
                <PageTitle subtitle={<>
                    <Badge>En cours</Badge>
                </>}>
                    N°{claim?.id} - {claim?.data?.claimType?.label ?? '...'}
                </PageTitle>

                <div className="grid md:grid-cols-2 gap-4 mt-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <strong>
                                    Contrat concerné
                                </strong>

                                <div>
                                    <Link href={'/policies/' + claim?.policy_id}>
                                        {claim?.policy?.id} - {ucfirst(claim?.policy?.product?.type)}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <strong>
                                    Type de sinistre
                                </strong>

                                <div className="flex flex-row gap-4">
                                    {claim?.data?.claimType?.label ?? '...'}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <strong>
                                    Date et heure du sinistre
                                </strong>

                                <div className="flex flex-row gap-4">
                                    {formatDate(claim?.created_at, true)}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <strong>
                                    Lieu du sinistre
                                </strong>

                                <div className="flex flex-row gap-4">
                                    {claim?.data?.claimPlace ?? '...'}
                                    {claim?.data?.claimComplementPlace ? <>, {claim?.data?.claimComplementPlace}</> : null}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <strong>
                                    Description du sinistre
                                </strong>

                                <div className="flex flex-row gap-4">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquam, velit eget aliquam egestas, ipsum lorem rhoncus justo, at lacinia quam nunc vel velit. Donec in lorem sit amet quam luctus aliquam. Nulla facilisi. Sed nec leo sit amet magna luctus hendrerit. Nullam ac ipsum vitae augue suscipit aliquet. Nullam ut diam vel nisl commodo rutrum. Sed eget nisl euismod, aliquet nisl nec, consequat quam. Sed quis faucibus urna. Cras eget libero quis nisl ultrices aliquam. Nullam ut diam vel nisl commodo rutrum. Sed eget nisl euismod, aliquet nisl nec, consequat quam. Sed quis faucibus urna. Cras eget libero quis nisl ultrices aliquam.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">

                        <Accordeon title={<>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faExplosion} width={18} height={18} className="text-gray-400" />
                                <strong>Dommage(s)</strong>
                            </div>
                        </>} isOpen={false}>

                            <h4 className="text-lg font-semibold">
                                Matériel(s)
                            </h4>

                            <div className="flex flex-col gap-4">
                                {claim?.data?.materialDamages ? 'Oui' : 'Non'}
                            </div>

                            {claim?.data?.materialDamages ? <p className="mt-4">
                                {claim?.data?.materialDammageDescription}
                            </p> : null}

                            <h4 className="text-lg font-semibold mt-4">
                                Corporel(s)
                            </h4>

                            <div className="flex flex-col gap-4">
                                {claim?.data?.bodilyDamages ? 'Oui' : 'Non'}
                            </div>

                            {claim?.data?.bodilyDamages ? <p className="mt-4">
                                {claim?.data?.bodilyDammageDescription}
                            </p> : null}

                        </Accordeon>

                        <Accordeon title={<>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faExplosion} width={18} height={18} className="text-gray-400" />
                                Témoins
                            </div>
                        </>} isOpen={false}>

                            {claim?.data?.hasWitnesses ? <>

                                {claim?.data?.witnesses?.map((witness, idx) => {

                                    return <div key={idx} className="flex flex-col gap-4">

                                        <h4 className="text-lg font-semibold">
                                            Témoin {idx + 1}
                                        </h4>

                                        <div className="flex flex-col gap-4">
                                            {witness?.firstname} {witness?.lastname}
                                            {witness?.phone}
                                            {witness?.email}
                                            {witness?.address}
                                            {witness?.complementAddress}
                                            {witness?.zipCode} {witness?.city}
                                        </div>

                                    </div>
                                })}
                                
                            </> : <strong>Pas de témoin</strong>}

                        </Accordeon>

                        <Accordeon title={<>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faExplosion} width={18} height={18} className="text-gray-400" />
                                <strong>Tiers</strong>
                            </div>
                        </>} isOpen={false}>

                        {claim?.data?.hasParties ? <>

                            {claim?.data?.parties?.map((party, idx) => {

                                return <div key={idx} className="flex flex-col gap-4">

                                    <h4 className="text-lg font-semibold">
                                        Tiers {idx + 1}
                                    </h4>

                                    <div className="flex flex-col gap-4">
                                        {party?.firstname} {party?.lastname}
                                        {party?.phone}
                                        {party?.email}
                                        {party?.address}
                                        {party?.complementAddress}
                                        {party?.zipCode} {party?.city}
                                    </div>

                                </div>
                            })}

                            </> : <strong>Pas de tiers</strong>}

                        </Accordeon>

                        <Accordeon title={<>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faExplosion} width={18} height={18} className="text-gray-400" />
                                <strong>Document(s) joint(s)</strong>
                            </div>
                        </>} isOpen={false}>

                            <div className="flex flex-col gap-2">
                                {(attachments ?? [])?.map((attachment, idx) => {
                                    return <span key={idx} className="text-blue-800 underline" onClick={() => window.open(attachment?.url, '_blank')}>
                                        {attachment?.name ?? '...'}
                                    </span>
                                })}
                            </div>

                        </Accordeon>

                    </div>

                </div>

            </div>
        </Page>
    </>
}