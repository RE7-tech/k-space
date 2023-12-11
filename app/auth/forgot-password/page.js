import Image from 'next/image'
import KlianLogo from '@/public/logo.svg';

export default function ForgotPassword ({ params }) {
    return <>
        <div className="flex flex-col items-center justify-center">
            <Image src={KlianLogo} width={200} height={200} />

            <h3 className="text-2xl font-bold mt-8 mb-4 text-center">
                Mot de passe oublié ?
            </h3>
        </div>
    </>
}