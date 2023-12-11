'use client';

import PageTitle from "@/components/PageTitle";
import Highlight from "@/components/Highlight";
import Page from "@/components/Page";
import DesktopTopbar from "@/components/DesktopTopbar";
import PolicyCard from "@/components/PolicyCard";
import { useRouter } from "next/navigation";
import usePolicies from "@/hooks/useCustomerPolicies";
import Spinner from "@/components/Spinner";
import Alert from "@/components/Alert";

export default function Policies({ params }) {

    const router = useRouter();

    const { policies, isLoading, isError } = usePolicies();

    const handlePolicyClick = (policy) => {
        return router.push(`/policies/${policy?.id}`);
    }

    const distinctPoliciesProducts = () => {
        let products = [];

        policies?.forEach(policy => {
            const exists = products.find(product => product?.id === policy?.product?.id);

            if (!exists) {
                products.push(policy?.product);
            }
        });

        return products;
    }

    return <>

        <Page>

            <DesktopTopbar breadcrumbs={[
                { name: 'Contrats', href: '/policies' },
            ]} />

            <div className="">
                <PageTitle>
                    Mes <Highlight>contrats</Highlight>
                </PageTitle>

                {isError ? <Alert variant="danger" className="mt-8">
                    Une erreur est survenue
                </Alert> : null}

                {isLoading ? <>
                
                    <div className="p-4">
                        <Spinner />
                    </div>
                    
                </> : <>

                    {(policies ?? [])?.length > 0 ? <>
                        <div className="flex items-center justify-between mb-2 text-gray-500 mb-8 mt-8">
                            <span>
                                {policies?.length ?? '...'} contrat{policies?.length > 1 ? 's' : ''}
                            </span>
                            <span>
                                <select className="border-0 bg-transparent text-gray-500 px-2">
                                    <option value="">Tous</option>
                                    {distinctPoliciesProducts()?.map((product, idx) => <option key={idx} value={product?.id}>{product?.type}</option>)}
                                </select>
                            </span>
                        </div>

                        <div className="flex flex-col gap-8">
                            {policies.map((policy, idx) => <PolicyCard key={idx} policy={policy} onClick={() => handlePolicyClick(policy)} className="mb-4" />)}
                        </div>
                    </> : <>
                        <div className="text-gray-500 text-center">
                            <p>
                                Pas encore Klian ?<br />
                                Ça ne saurait tarder 😉.
                            </p>
                        </div>
                    </>}</>}

            </div>
        </Page>

    </>

}