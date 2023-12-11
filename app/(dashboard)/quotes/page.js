'use client';

import Button from "@/components/Button";
import DesktopTopbar from "@/components/DesktopTopbar";
import Highlight from "@/components/Highlight";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import QuoteCard from "@/components/QuoteCard";
import { useRouter } from "next/navigation";
import config from "@/utils/config";
import useQuotes from "@/hooks/useCustomerQuotes";
import useCustomer from "@/hooks/useCustomer";
import Spinner from "@/components/Spinner";

export default function Quotes({ params }) {

    const router = useRouter();
    const { customer } = useCustomer();

    let { quotes, isLoading, isError } = useQuotes({ customer_id: customer?.id });

    const handleQuoteClick = (quote) => {
        const redirectUrl = config?.app?.subscriptionUrl + '/offers/' + quote.id;

        window.open(redirectUrl, '_blank');
    }

    quotes = quotes?.filter(quote => parseFloat(quote?.total_premium ?? 0) > 0);

    return <>
        <Page>
            <DesktopTopbar breadcrumbs={[
                { name: 'Devis', href: '/quotes' },
            ]} />

            <div className="">
                <PageTitle>
                    Mes <Highlight>devis</Highlight>
                </PageTitle>

                <div className="mt-8">

                    {isLoading ? <Spinner /> : <>

                        {quotes?.length > 0 ? <>

                            <div className="flex items-center justify-end mb-2 text-gray-500 mb-4">
                                {quotes?.length ?? '...'} devis
                            </div>

                            <div className="flex flex-col gap-8">
                                {(quotes ?? [])?.map((quote, idx) => <QuoteCard key={idx} quote={quote} onClick={() => handleQuoteClick(quote)} />)}
                            </div>

                        </> : <>

                            <div className="text-center text-gray-500 flex flex-col items-center justify-center gap-4">
                                <p>Nous n’avons pas de devis enregistré, ça ne saurait tarder 😉</p>
                                <Button variant="outline_primary" className="p-4" onClick={() => window.location.href = 'https://klian.fr'}>
                                    Nouveau devis
                                </Button>
                            </div>

                        </>}

                    </>}
                </div>
            </div>
        </Page>
    </>

}