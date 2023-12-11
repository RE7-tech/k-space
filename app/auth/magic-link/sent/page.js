'use client';

import Image from "next/image";
import MagicLinkImg from "@/public/misc/magiclink.svg";
import Button from "@/components/Button";
import Page from "@/components/Page";
import { useSearchParams } from "next/navigation";

export default function MagicLinkSent({ params }) {

    const email = useSearchParams().get('email');

    const openMailBox = (email) => {
        const emaiLDomain = email?.split('@')?.[1] ?? null;

        switch (emaiLDomain) {
            case 'gmail.com':
                window.open('https://mail.google.com/mail/u/0/#inbox');
                break;
            case 'outlook.com':
                window.open('https://outlook.live.com/mail/0/inbox');
                break;
            case 'yahoo.com':
                window.open('https://mail.yahoo.com/d/folders/1');
                break;
            case 'icloud.com':
                window.open('https://www.icloud.com/mail');
                break;
            case 'orange.fr':
                window.open('https://mail.orange.fr');
                break;
            case 'sfr.fr':
                window.open('https://webmail.sfr.fr');
                break;
            case 'laposte.net':
                window.open('https://www.laposte.net');
                break;
            case 'free.fr':
                window.open('https://zimbra.free.fr');
                break;
            case 'bbox.fr':
                window.open('https://mail.bbox.fr');
                break;
            case 'wanadoo.fr':
                window.open('https://webmail.wanadoo.fr');
                break;
            default:
                window.open('https://mail.google.com/mail/u/0/#inbox');
                break;
        }
    }

    return <>

        <Page>
            <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                <div className="flex flex-col items-center justify-center">
                    <Image src={MagicLinkImg} height={123} alt="magic link icon" />
                </div>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-center">
                    Votre lien lien magique a été envoyé à {email ?? 'votre adresse email'}
                </h3>

                <p className="text-gray-500 text-center">
                    Vérifiez votre boite mail pour vous connecter
                </p>

                <Button variant="primary" className="w-full mt-8" onClick={() => openMailBox(email)}>
                    D'accord !
                </Button>

                <div className="flex flex-col items-center justify-center mt-8 text-center text-gray-500">
                    Pas reçu d'email ?<br />
                    Contactez nous au <a href="tel:+33278848484" className="text-blue-800">02 78 84 84 84</a>
                </div>
            </div>
        </Page>
    </>
}