'use client';

import PageTitle from "@/components/PageTitle";
import Page from "@/components/Page";
import ClaimCard from "@/components/ClaimCard";
import DesktopTopbar from "@/components/DesktopTopbar";
import Highlight from "@/components/Highlight";
import Button from "@/components/Button";
import useCustomerClaims from "@/hooks/useCustomerClaims";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import { useViewport } from "react-viewport-hooks";
import config from "@/utils/config";
import DesktopPolicyClaims from "@/components/DesktopPolicyClaims";

export default function Claims({ params }) {

    const { claims, isLoading: isClaimsLoading, isError: isClaimsError } = useCustomerClaims();

    const router = useRouter();

    const { vw, vh } = useViewport();

    const handleClaimClick = (claim) => {
        router.push('/claims/' + claim?.id);
    }

    return <>
        <Page>
            <DesktopTopbar breadcrumbs={[
                { name: 'Mes sinistres', href: '/claims' },
            ]} />

            <div className="">

                <div className="flex flex-row justify-between gap-4 my-4">
                    <PageTitle>
                        Mes <Highlight>sinistres</Highlight>
                    </PageTitle>

                    {vw < config.breakpoints.md ? <>
                        <Button variant={'primary'} onClick={() => router.push('/claims/new')} isFullWidth={true}>
                            Déclarer
                        </Button>
                    </> : null}
                </div>

                <div className="mt-8">

                    {vw < config.breakpoints.md ? <>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between gap-4 my-4 text-gray-400">
                                <div>{claims?.length} sinistre{
                                    claims?.length > 1 ? 's' : ''
                                }</div>
                                <div>
                                    <select className="bg-transparent border-0" name="status" id="status">
                                        <option value="all">Tous</option>
                                        <option value="pending">En cours</option>
                                        <option value="accepted">Acceptés</option>
                                        <option value="refused">Refusés</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </> : null}

                    {(claims ?? []).length > 0 ? <div className="flex flex-col gap-4">
                        <>
                            {vw <= config.breakpoints.md ? <div className="flex flex-col gap-4">
                                {claims.map((claim, idx) => {
                                    return <ClaimCard key={idx} claim={claim} onClick={() => handleClaimClick(claim)} />
                                })} </div> : <div>
                                <DesktopPolicyClaims policyClaims={claims} />
                            </div>}
                        </>
                    </div> : <div className="flex flex-col items-center justify-center gap-4">
                        <span className="text-gray-400">
                            Ouf ! Vous n'avez pas de sinistre en cours.
                        </span>

                            <Button variant={'outline_primary'} onClick={() => router.push('/claims/new')}>
                                Déclarer un sinistre
                            </Button>

                    </div>}
                </div>
            </div>
        </Page>
    </>
}