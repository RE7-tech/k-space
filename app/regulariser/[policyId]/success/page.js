'use client';

import Page from '@/components/Page';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function SuccessfullRegularization({ params }) {

    const router = useRouter();

    return <>

        <Page>

            <div className="flex flex-col justify-center max-w-xl mx-auto">
                <div className="flex flex-row justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-8xl" />
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-center">
                    Votre régularisation a bien été prise en compte.
                </h3>

                <p className="text-gray-500 text-center">
                    Veillez à avoir des fonds suffisants sur votre compte bancaire la prochaine fois pour que le prélèvement puisse être effectué, sinon vous risquez (encore) de payer des frais supplémentaires. <br/><br/>
                    N'oubliez pas que le non-paiement de vos cotisations peut entraîner la résiliation de votre contrat et vous pénaliser lors de la souscription d'un nouveau contrat.
                </p>

                <Button variant="primary" className="w-full mt-8" onClick={() => router.push('/policies/' + params.policyId)}>
                    Accéder à mon contrat
                </Button>

            </div>


        </Page>
    </>

}
