'use client';

import DesktopTopbar from "@/components/DesktopTopbar";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import usePolicyClaims from "@/hooks/usePolicyClaims";
import usePolicy from "@/hooks/usePolicy";
import DesktopPolicyClaims from "@/components/DesktopPolicyClaims";

export default function Claims({ params }) {

    const policyId = params?.policyId;

    const { policy, loading: policyLoading, error: policyError } = usePolicy(policyId);
    const { policyClaims, loading: policyClaimsLoading, error: policyClaimsError } = usePolicyClaims(policyId);

    return <>
        <Page>
            <DesktopTopbar breadcrumbs={[
                { name: 'Mes contrats', href: '/policies' },
                { name: 'Contrat' + (policy?.product?.type), href: '/policies/' + policyId },
                { name: 'Mes sinistres', href: '/policies/' + policyId + '/claims' },
            ]} />

            <div className="mt-8">

                <PageTitle subtitle={<>
                    Un sinistre doit être déclaré dans les 48h, déclarez-le vôtre grâce à notre formulaire 100% en ligne !
                </>} subtitleClassName={`text-lg font-normal opacity-70`}>
                    Mes sinistres {policy?.product?.type ?? '...'}
                </PageTitle>

                <DesktopPolicyClaims policyClaims={policyClaims} />

            </div>

        </Page>
    </>
}