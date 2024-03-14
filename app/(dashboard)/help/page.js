'use client';

import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faMessage, faPhone } from "@fortawesome/free-solid-svg-icons";
import ColoredCard from "@/components/ColoredCard";
import DesktopTopbar from "@/components/DesktopTopbar";
import { faFacebookMessenger, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function Help({ }) {
    return <>
        <Page>
            <DesktopTopbar breadcrumbs={[{ href: '/dashboard/help', name: 'Aide' }]} />

            <div className="">
                <PageTitle>Aide</PageTitle>


                <div className="mt-8">

                    <p>
                        Besoin d’aide sur l’espace client ? Vous trouverez ici différents moyens de nous contacter.
                    </p>

                    <h5 className="mt-8 text-xl mb-4">
                        Une question ?
                    </h5>

                    <div className="gap-4 mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">

                        <ColoredCard color="yellow" className="flex flex-col gap-4 justify-center items-center" onClick={() => window.open('https://klian.fr', '_blank')}>

                            <FontAwesomeIcon icon={faMessage} width={18} height={18} className="" size="lg" />

                            Chatter

                        </ColoredCard>

                        <ColoredCard color="green" className="flex flex-col gap-4 justify-center items-center" onClick={() => window.open('https://api.whatsapp.com/send/?phone=278848484&text&type=phone_number&app_absent=0', '_blank')}>

                            <FontAwesomeIcon icon={faWhatsapp} width={18} height={18} className="" size="lg" />

                            WhatsApp

                        </ColoredCard>

                        <ColoredCard color="blue" className="flex flex-col gap-4 justify-center items-center" onClick={() => window.open('https://fb.com/klianfr', '_blank')}>

                            <FontAwesomeIcon icon={faFacebookMessenger} width={18} height={18} className="" size="lg" />

                            Messenger

                        </ColoredCard>

                        <ColoredCard color="red" className="flex flex-col gap-4 justify-center items-center" onClick={() => window.open('tel:0278848484', '_blank')}>

                            <FontAwesomeIcon icon={faPhone} width={18} height={18} className="" size="lg" />

                            02 78 84 84 84

                        </ColoredCard>

                    </div>

                </div>

            </div>
        </Page>
    </>
}