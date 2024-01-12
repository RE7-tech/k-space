const config = {
    api: {
        url: process.env.NEXT_PUBLIC_API_URL ?? 'https://360.api.re7.tech',
    },
    app: {
        websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'https://klian.fr',
        subscriptionUrl: process.env.NEXT_PUBLIC_SUBSCRIPTION_URL ?? 'https://souscription.klian.fr',
        maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE ?? false,
    },
    breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
    },
    infos: {
        prettyPhone: process.env.NEXT_PUBLIC_PRETTY_PHONE ?? '02 78 84 84 84',
        rawPhone: process.env.NEXT_PUBLIC_RAW_PHONE ?? '0278848484',
        facebookPageUrl: process.env.NEXT_PUBLIC_FB_ID ?? 'klianfr',
        whatsappUrl: process.env.NEXT_PUBLIC_WA_NBR ?? 'https://wa.me/278848484',
        email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@klian.fr',
        certimat: process.env.NEXT_PUBLIC_CERTIMAT_URL ?? 'https://certimat.fr/prescripteurs?partner=2240'
    },
}

export default config