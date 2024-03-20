'use client';

import Highlight from "@/components/Highlight";
import React from "react";
import Page from "@/components/Page";
import {confirmEmailChange} from "@/lib/api/users";
import {useRouter} from "next/navigation";
import {useSearchParams} from "next/navigation";

export default function ConfirmationChangementEmail () {

    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);

    const urlParams = useSearchParams();

    const router = useRouter();
    const token = urlParams.get('token');

    const sendConfirmationEmail = async () => {
        try {
            const response = await confirmEmailChange({
                token: token,
            });
            console.log('response', response);
        } catch (error) {
            console.error('error', error);
            setIsError(true);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        sendConfirmationEmail().then(() => {
            setTimeout(() => {
                router.push('/');
            }, 1500);
        });
    }, []);

    return (
        <Page>
            <div className="flex flex-col items-center justify-center">
                {isLoading && <div>Chargement...</div>}
                {isError && <div>Erreur lors de la confirmation de l'email</div>}
                {!isLoading && !isError && <Highlight>Confirmation de l'email effectuée avec succès</Highlight>}
            </div>
        </Page>
    );
}