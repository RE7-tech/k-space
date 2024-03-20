'use client';

import Image from 'next/image'
import MagicLinkImg from '@/public/misc/magiclink.svg'
import Button from '@/components/Button';
import { useRouter, useSearchParams } from 'next/navigation'
import Page from '@/components/Page'
import { useEffect, useState } from 'react';
import { sendMagicLink } from '@/lib/api/users';
import Alert from '@/components/Alert';

export default function MagicLink({ params }) {

    const router = useRouter();
    const email = useSearchParams().get('email');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendMagicLink = async () => {

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            await sendMagicLink(email);

            setIsSubmitting(false);

            router.push('/auth/magic-link/sent?' + new URLSearchParams({ email }).toString());

        } catch (error) {
            console.error(error);
            setErrors({ email: 'Une erreur est survenue lors de l\'envoi du lien magique' });
        }
    }

    return <>
        <Page>
            <div className="flex flex-col justify-center max-w-xl mx-auto">

                <div className="flex flex-row justify-center mb-8">
                    <Image alt="" src={MagicLinkImg} height={123} />
                </div>

                <h3 className="text-3xl font-semibold mt-4 mb-2 text-center">
                    Fatigué de retenir vos mots de passe ?
                </h3>

                <p className="text-lg text-gray-600 text-center">
                    Connectez-vous à votre espace personnel en un clic grâce à un lien magique envoyé par email.
                </p>

                {errors?.email ? <>
                    <Alert variant="error" className="mt-4">
                        {errors?.email}
                    </Alert>
                </> : null}

                <div className="flex flex-col justify-center gap-2 mt-8 w-full">

                    <Button variant="primary" className="w-full" onClick={handleSendMagicLink} isLoading={isSubmitting}>
                        Recevoir mon lien magique
                    </Button>

                    <Button variant="outline_primary" className="w-full" onClick={() => {
                        router.push('/auth/password?' + new URLSearchParams({ email }).toString());
                    }}>
                        Se connecter avec un mot de passe
                    </Button>

                </div>

            </div>
        </Page>
    </>
}