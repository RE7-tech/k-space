'use client';

import Page from '@/components/Page'
import Alert from '@/components/Alert'
import Highlight from '@/components/Highlight'
import Card from '@/components/Card'
import Link from 'next/link'
import DesktopTopbar from '@/components/DesktopTopbar'
import PolicySmallCard from '@/components/PolicySmallCard'
import QuoteSmallCard from '@/components/QuoteSmallCard'
import ClaimSmallCard from '@/components/ClaimSmallCard'
import Image from 'next/image'
import certimat from '@/public/misc/certimat.svg'
import Button from '@/components/Button'
import { useEffect, useState } from 'react'
import { ucfirst } from '@/utils/format';
import useCustomer from '@/hooks/useCustomer';
import useQuotes from '@/hooks/useCustomerQuotes';
import usePolicies from '@/hooks/useCustomerPolicies';
import useCustomerClaims from '@/hooks/useCustomerClaims';
import { useRouter } from 'next/navigation';
import { useViewport } from 'react-viewport-hooks';
import config from '@/utils/config';

export default function Home() {

  const [alertClosed, setAlertClosed] = useState(false);
  const { customer } = useCustomer();
  const router = useRouter();

  const { policies, isLoading: isPoliciesLoading, isError: isPoliciesError } = usePolicies();
  const { quotes, isLoading: isQuotesLoading, isError: isQuotesError } = useQuotes();
  const { claims, isLoading: isClaimsLoading, isError: isClaimsError } = useCustomerClaims();
  const { vw, vh } = useViewport();

  const handleAlertClose = () => {
    localStorage.setItem('alertClosed', true);
    setAlertClosed(true);
  }

  const handlePolicyClick = (policy) => {
    router.push(`/policies/${policy?.id}`);
  }

  const handleQuoteClick = (quote) => {
    router.push(`/quotes/${quote?.id}`);
  }

  const handleClaimClick = (claim) => {
    router.push(`/claims/${claim?.id}`);
  }

  useEffect(() => {
    if (localStorage.getItem('alertClosed')) {
      setAlertClosed(true);
    }
  }, []);

  return (
    <>
      <Page>

        <DesktopTopbar />

        <div>
          {alertClosed ? <Alert variant="info" onClose={handleAlertClose}>
            Ici, vous pouvez tout piloter : vos contrats, vos sinistres, vos informations et échanger avec nous à la moindre interrogation ❤️
          </Alert> : null}

          <h1 className="text-4xl font-bold">
            Bonjour <br className="sm:hidden" />
            <Highlight>{ucfirst(customer?.firstname?.toLowerCase())}</Highlight> ! 👋
          </h1>

          {/* Create a grid 2 columns 2 rows on desktop, 1 column 4 rows on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">

            <div className="col-span-2 md:col-span-1">
              <Card header={<>
                <div className="flex justify-between items-center mb-4">

                  <div className="flex items-center gap-2">
                    <span className='text-3xl font-bold'>
                      Mes contrats
                    </span>

                    <span className="text-gray-500 text-xl">
                      ({policies?.length ?? 0})
                    </span>
                  </div>

                  <Link href="/policies" className="text-gray-400 underline underline-offset-[3px]">
                    Voir tout
                  </Link>
                </div>
              </>} sizeMode={'adaptive'}>
                <div className="flex justify-center items-center mb-4 gap-4 overflow-x-auto">

                  {(policies ?? []).filter((policy, idx) => idx < 3).map((policy, idx) => <PolicySmallCard key={idx} policy={policy} onClick={() => handlePolicyClick(policy)} />)}

                  {policies?.length === 0 ? <div className="flex flex-col items-center justify-center gap-4 text-center">
                    Vous n'avez pas de contrat en cours.
                  </div> : null}
                </div>
              </Card>
            </div>

            <div className="col-span-2 md:col-span-1">
              <Card header={<>
                <div className="flex justify-between items-center mb-4">

                  <div className="flex items-center gap-2">
                    <span className='text-3xl font-bold'>
                      Mes devis
                    </span>

                    <span className="text-gray-500 text-xl">
                      ({quotes?.length ?? 0})
                    </span>
                  </div>

                  <Link href="/quotes" className="text-gray-400 underline underline-offset-[3px]">
                    Voir tout
                  </Link>
                </div>
              </>}>
                <div className="flex flex-col gap-4">
                  {(quotes ?? []).map((quote, idx) => <QuoteSmallCard key={idx} quote={quote} onClick={() => handleQuoteClick(quote)} />)}
                  {quotes?.length === 0 ? <div className="flex flex-col items-center justify-center gap-4">
                    Vous n'avez pas de devis en cours.
                  </div> : null}
                </div>

                {vw < config.breakpoints.md ? <div className="flex justify-center items-center mt-4 gap-4">

                  <Button variant="outline_primary" className="px-8 py-4" onClick={() => router.push('/claims/new')} isFullWidth={true}>
                    Faire un devis
                  </Button>

                </div> : null}
              </Card>
            </div>

            <div className="col-span-2 md:col-span-1">
              <Card header={<>
                <div className="flex justify-between items-center mb-4">

                  <div className="flex items-center gap-2">
                    <span className='text-3xl font-bold'>
                      Mes sinistres
                    </span>

                    <span className="text-gray-500 text-xl">
                      ({claims.length ?? 0})
                    </span>
                  </div>

                  <Link href="/claims" className="text-gray-400 underline underline-offset-[3px]">
                    Voir tout
                  </Link>
                </div>
              </>}>
                <div className="flex flex-col mb-4 gap-4 max-h-[400px] overflow-y-auto">
                  {(claims ?? []).map((claim, idx) => <ClaimSmallCard key={idx} claim={claim} onClick={() => handleClaimClick(claim)} />)}
                  {claims?.length === 0 ? <div className="flex flex-col items-center justify-center gap-4">
                    Ouf ! Vous n'avez pas de sinistre en cours.
                  </div> : null}
                </div>

              </Card>
            </div>

            <div className="col-span-2 md:col-span-1">
              <Card header={<>
                <div className="flex justify-between items-center mb-4">

                  <div className="flex items-center gap-2">
                    <span className='text-3xl font-bold'>
                      Mes services plus
                    </span>
                  </div>

                </div>
              </>}>

                <div className="bg-gray-50 p-4 rounded-md flex-1 rounded-xl relative cursor-pointer hover:bg-gray-100">

                  {/* Mobile: col, Desktop: row */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-center">

                    <h4 className="text-xl font-normal text-blue-900">
                      Immatriculation
                    </h4>

                    <Image src={certimat} className="mb-2" alt="" />

                  </div>

                  <p>Vente, cession, changement d’adresse, changement de nom, modification du véhicule, perte, vol ou détérioration de votre carte grise…</p>

                  <div className="flex justify-center items-center mt-4 gap-4">
                    <Button variant="primary" className="px-8 py-4" onClick={() => window.open('https://certimat.fr', '_blank')}>
                      En savoir plus
                    </Button>
                  </div>
                </div>

              </Card>
            </div>

          </div>
        </div>

      </Page>
    </>
  )
}
