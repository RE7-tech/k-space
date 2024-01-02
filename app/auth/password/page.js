'use client';

import InputField from '@/components/InputField';
import Image from 'next/image';
import LogoKlian from '@/public/logo.svg';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import Page from '@/components/Page';
import { useEffect, useState } from 'react';
import { loginUser } from '@/lib/api/users';
import { redirect } from 'next/navigation';

export default function Password({ children }) {

    const router = useRouter();
    const email = useSearchParams().get('email');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!email) {
        router.push('/auth/login');
    }

    const canSubmit = password.length > 0 && Object.keys(errors).length === 0 && !isSubmitting;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canSubmit) return;

        setIsSubmitting(true);

        try {
            const login = await loginUser({ email, password });

            const authToken = login?.data?.data?.token ?? null;

            if (!authToken) {
                setErrors({ password: 'Le mot de passe saisi est incorrect' });
                return;
            }

            localStorage.setItem('auth_token', authToken);

            setTimeout(() => {
                window.location.href = '/';
            }, 200);

        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 404) {
                setErrors({ password: 'Le mot de passe saisi est incorrect' });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const validate = () => {
        const errors = {};

        if (!password) {
            errors.password = 'Veuillez saisir votre mot de passe';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    }

    useEffect(() => {
        validate();
    }, [password]);

    return <>
        <Page>
            <div className="flex flex-col items-center justify-center gap-4 max-w-sm mx-auto ">

                <Image alt="" src={LogoKlian} height={123} />

                <h2 className="text-3xl font-semibold mt-4 mb-0 text-center">
                    Mon espace personnel
                </h2>

                <p className="text-gray-500 text-center m-0">
                    Saisissez le mot de passe lié à {email ?? 'votre adresse email'} pour vous connecter.
                </p>

                <div className="flex flex-col justify-center gap-2 mt-4 w-full">

                    <form onSubmit={handleSubmit} id="login-form">

                        <InputField value={password} type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} error={password?.length > 0 ? errors.password : null} />

                    </form>

                </div>

                <div className="flex flex-row items-center justify-between gap-2 mt-4 w-full">

                    <Button variant="outline_primary" className="w-full" onClick={() => router.back()} tabIndex={-1}>
                        <FontAwesomeIcon icon={faArrowLeft} width={18} height={18} />
                        Retour
                    </Button>

                    <Button variant="primary" className="w-full" disabled={!canSubmit} type="submit" form="login-form">
                        Se connecter
                    </Button>

                </div>

            </div>
        </Page>
    </>
}