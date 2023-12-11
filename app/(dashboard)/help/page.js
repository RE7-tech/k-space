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
                        Besoin d’aide sur l’espace client ? Votre espace personnel n’aura plus de secret pour vous grâce à notre <a href="#" className="text-blue-800 underline">
                            tuto en 4 clics
                        </a>
                    </p>

                    <h5 className="mt-8 text-xl mb-4">
                        Une question ?
                    </h5>

                    <div className="gap-4 mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">

                        <ColoredCard color="yellow" className="flex flex-col gap-4 justify-center items-center">

                            <FontAwesomeIcon icon={faMessage} width={18} height={18} className="" size="lg" />

                            Chatter

                        </ColoredCard>

                        <ColoredCard color="green" className="flex flex-col gap-4 justify-center items-center">

                            <FontAwesomeIcon icon={faWhatsapp} width={18} height={18} className="" size="lg" />

                            WhatsApp

                        </ColoredCard>

                        <ColoredCard color="blue" className="flex flex-col gap-4 justify-center items-center">

                            <FontAwesomeIcon icon={faFacebookMessenger} width={18} height={18} className="" size="lg" />

                            Messenger

                        </ColoredCard>

                        <ColoredCard color="red" className="flex flex-col gap-4 justify-center items-center">

                            <FontAwesomeIcon icon={faPhone} width={18} height={18} className="" size="lg" />

                            02 123 45 67

                        </ColoredCard>

                    </div>

                </div>

            </div>
        </Page>
    </>
}