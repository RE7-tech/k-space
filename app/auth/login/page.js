'use client';

import Image from 'next/image';
import Page from '@/components/Page';
import Link from 'next/link';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { useEffect, useState } from 'react';
import validateEmail from '@/utils/validate';
import { useRouter } from 'next/navigation';

export default function Login({ params }) {

    const router = useRouter();
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        console.log(e.target.name, e.target.value);
        setFields({ ...fields, [e.target.name]: e.target.value });
    }

    const canSubmit = () => {
        return Object.keys(errors).length === 0;
    }

    const validate = () => {
        const errors = {};

        if (!fields.email) {
            errors.email = 'Veuillez saisir votre email';
        }

        if (!validateEmail(fields.email)) {
            errors.email = 'Veuillez saisir un email valide';
        }

        console.log('errors', errors, fields);

        setErrors(errors);

        return Object.keys(errors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!canSubmit()) {
            return;
        }

        let isEmailKnown = checkIfEmailIsKnown();

        if (!isEmailKnown) {
            router.push('/auth/first-connection', { query: { email: fields.email } });
        }
        
        router.push('/auth/magic-link?' + new URLSearchParams({ email: fields.email }).toString());

        return false;
    }

    const checkIfEmailIsKnown = async () => {
        return true;
    }

    useEffect(() => {
        validate();
    }, [fields]);

    return <>

        <Page>

            <div className="flex flex-col justify-center max-w-sm mx-auto">
                <div className="flex flex-row justify-center">
                    <Image src="/logo.svg" width={200} height={200} alt="" />
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-center">
                    Mon espace personnel
                </h3>

                <p className="text-gray-500 text-center">
                    Saisissez votre adresse email pour vous connecter à votre espace personnel.
                </p>

                <div className="flex flex-col justify-center gap-2 mt-8">
                    <InputField value={fields.email} type="email" placeholder="Email" onChange={handleChange} name="email" error={fields.email?.length > 0  ? errors.email : null} />
                </div>

                <Button variant="primary" className="w-full mt-4" disabled={!canSubmit()} onClick={handleSubmit} isLoading={isSubmitting}>
                    Se connecter
                </Button>

                <div className="flex flex-row justify-center gap-2 mt-16">
                    <Link href="/auth/forgot-password" className="text-blue-800 underline underline-offset-[3px]" >
                        Mot de passe oublié ?
                    </Link>
                </div>

            </div>


        </Page>
    </>

}
