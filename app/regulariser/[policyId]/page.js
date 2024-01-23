'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Page from "@/components/Page";
import { createPolicyPayment, getPolicy } from "@/lib/api/policies";
import { useState, useEffect } from 'react';
import config from "@/utils/config";
import Button from '@/components/Button';
import { formatEuro, ucfirst } from '@/utils/format';
import Card from '@/components/Card';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Highlight from '@/components/Highlight';
import { set } from 'react-hook-form';

const stripePromise = loadStripe(config.stripe.publicKey);

const CheckoutForm = ({
    onPaymentFailure,
    onPaymentSuccess,
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: window.location.href + '/success',
            },
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);

            onPaymentFailure(result);

        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.

            onPaymentSuccess(result);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />


            <Button variant={`primary`} type="submit" disabled={!stripe} label={'Payer'} isFullWidth={true} className={`mt-6`} />
        </form>
    )
};

export default function Regulariser({ params }) {
    const policyId = params?.policyId;
    const [policyBalance, setPolicyBalance] = useState({});
    const [options, setOptions] = useState({});
    const [clientSecret, setClientSecret] = useState('');
    const [policy, setPolicy] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const urlParams = new URLSearchParams(window.location.search);
    const [isPolicyLoading, setIsPolicyLoading] = useState(true);
    const [isPolicyPaymentLoading, setIsPolicyPaymentLoading] = useState(true);
    const [isRegularizationNeeded, setIsRegularizationNeeded] = useState(true);

    const loadPolicyPayment = async () => {
        try {
            setIsPolicyPaymentLoading(true);
            const response = await createPolicyPayment(policyId);
            const clientSecret = response?.data?.data?.client_secret;
            const balance = response?.data?.data?.balance;
            const infos = response?.data?.data?.infos;
            const transactions = response?.data?.data?.transactions;

            console.log('infos', infos, transactions);

            setClientSecret(clientSecret);
            setPolicyBalance(Math.abs(balance));
            setPolicy(infos);
            setTransactions(transactions);
        } catch (error) {
            console.log(error);

            // if data.amount <= 0 there is no payment to do
            if (Math.abs(error?.response?.data?.data?.amount || 0) <= 0) {
                setIsRegularizationNeeded(false);
            }
        } finally {
            setIsPolicyPaymentLoading(false);
        }
    }

    const loadPolicy = async () => {
        try {
            setIsPolicyLoading(true);
            const response = await getPolicy(policyId);
            const policy = response?.data?.data;

            setPolicy(policy);
        } catch (error) {
            console.log(error);
        } finally {
            console.log('policy', policy);
            setIsPolicyLoading(false);
        }
    }

    useEffect(() => {
        loadPolicyPayment();
    }, [policyId]);

    if (!policyId) {
        return (
            <Page>
                <p>Vous devez renseigner un numéro de contrat pour pouvoir régulariser votre situation.</p>
            </Page>
        );
    }

    if (isPolicyPaymentLoading) {
        return (
            <Page>
                <FontAwesomeIcon icon={faSpinner} spin={true} />
            </Page>
        );
    }

    if (!isRegularizationNeeded) {
        return (
            <Page>
                <p>Vous n'avez pas de régularisation à effectuer.</p>
            </Page>
        );
    }

    return (
        <Page>
            <div className="flex flex-col justify-center max-w-xl mx-auto">
                <h2 className="text-4xl font-bold mt-8 mb-8 text-center">
                    Régulariser{' '}<Highlight>ma situation</Highlight>
                </h2>

                {errors?.message && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded relative" role="alert">
                    <span className="block sm:inline">
                        <strong>
                            Le paiement a échoué :{' '}
                        </strong>
                        {errors?.message}
                    </span>
                </div>}

                <div className="flex flex-row justify-between p-4 px-0 text-lg">
                    <span className="text-gray-500">
                        Contrat n°{policyId} - {ucfirst(policy?.product?.type)}
                    </span>
                    <span className="font-bold">
                        {formatEuro(policyBalance)}
                    </span>
                </div>

                {(transactions || [])?.map((transaction, index) => {
                    return <Card className={`mt-4 mb-4`} key={index} header={<>
                        <div onClick={() => setIsTransactionsOpen(!isTransactionsOpen)} className="flex flex-row justify-between cursor-pointer items-center">
                            <span className="font-semibold">
                                Détails de ce que vous devez
                            </span>
                            <span className="text-gray-500">
                                {isTransactionsOpen ? <FontAwesomeIcon icon={faChevronUp} /> :
                                    <FontAwesomeIcon icon={faChevronDown} />}
                            </span>
                        </div>
                    </>}>
                        <div className="flex flex-row justify-between mt-4" style={{ display: isTransactionsOpen ? 'flex' : 'none' }}>
                            <span className="text-gray-500">
                                Échéance #{transaction?.id} - Du{' '}
                                <i>{moment(transaction?.start_at).format('DD/MM/YYYY')}</i> au <i>{moment(transaction?.end_at).format('DD/MM/YYYY')}</i>
                            </span>
                            <span className="font-bold">
                                {formatEuro(transaction?.amount)}
                            </span>
                        </div>
                    </Card>
                })}

                <Card className={`mt-2`}>
                    <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
                        <CheckoutForm policyId={policyId} onPaymentFailure={(result) => { setErrors(result.error) }} onPaymentSuccess={(result) => { console.log('result', result) }} />
                    </Elements>
                </Card>
            </div>
        </Page>
    );
}
