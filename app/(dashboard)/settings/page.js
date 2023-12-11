'use client';

import Accordeon from "@/components/Accordeon";
import DesktopTopbar from "@/components/DesktopTopbar";
import Highlight from "@/components/Highlight";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ucfirst, uppercase } from "@/utils/format";
import useCustomer from "@/hooks/useCustomer";
import { useForm } from "react-hook-form";
import { updateCustomer } from "@/lib/api/customers";
import Button from "@/components/Button";
import { useState } from "react";
import Alert from "@/components/Alert";

export default function Settings({ params }) {

    const { customer } = useCustomer();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            await updateCustomer(customer?.id, {
                password: data.new_password,
            });

            setIsPasswordUpdated(true);
        } catch (error) {
            console.log(error);
            setIsPasswordUpdated(false);
        } finally {
            setIsLoading(false);
        }
    }

    return <>
        <Page>
            <DesktopTopbar breadcrumbs={
                [
                    {
                        name: 'Paramètres',
                        href: '/settings',
                    },
                ]
            } />

            <div className="">
                <PageTitle>
                    <Highlight>Paramètres</Highlight> de compte
                </PageTitle>

                <div className="mt-8">

                    <Accordeon title={<>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className="text-gray-400" />
                            <strong>Informations personnelles</strong>
                        </div>
                    </>} className={'mb-8'}>

                        {customer?.gender === 'male' && 'Monsieur'}
                        {customer?.gender === 'female' && 'Madame'}
                        {ucfirst(customer?.firstname)} {uppercase(ucfirst(customer?.lastname))}<br />
                        {customer?.primary_email}<br />
                        {customer?.address}<br />
                        {customer?.postal_code} {customer?.city}<br />

                    </Accordeon>

                    <Accordeon title={<>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faChevronRight} width={18} height={18} className="text-gray-400" />
                            <strong>Mot de passe</strong>
                        </div>
                    </>} className={'mb-4'}>

                        {isPasswordUpdated && <Alert variant="success" className="mb-4">
                            Votre mot de passe a bien été modifié.
                        </Alert>}

                       <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

                            <label htmlFor="old_password">Ancien mot de passe</label>
                            <input type="password" placeholder="" className="border border-gray-300 rounded-md p-2" {...register('old_password', { required: true })} />

                            <label htmlFor="new_password">Nouveau mot de passe</label>
                            <input type="password" placeholder="" className="border border-gray-300 rounded-md p-2" {...register('new_password', { required: true })} />

                            <Button variant="primary" isLoading={isLoading} disabled={isLoading || Object.keys(errors).length > 0} type="submit">
                                Modifier
                            </Button>

                        </form>
                    </Accordeon>

                </div>
            </div>

        </Page>
    </>

}