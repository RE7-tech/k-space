const config = {
    api: {
        url: process.env.NEXT_PUBLIC_API_URL || 'https://dev.360.api.re7.tech',
    },
    app: {
        websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://klian.fr',
        subscriptionUrl: process.env.NEXT_PUBLIC_SUBSCRIPTION_URL || 'https://souscription.klian.fr',
        maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE || false,
    },
    breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
    },
    infos: {
        prettyPhone: process.env.NEXT_PUBLIC_PRETTY_PHONE || '02 78 84 84 84',
        rawPhone: process.env.NEXT_PUBLIC_RAW_PHONE || '0278848484',
        facebookPageUrl: process.env.NEXT_PUBLIC_FB_ID || 'klianfr',
        whatsappUrl: process.env.NEXT_PUBLIC_WA_NBR || 'https://wa.me/278848484',
        email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@klian.fr',
        certimatUrl: process.env.NEXT_PUBLIC_CERTIMAT_URL || 'https://certimat.fr/prescripteurs?partner=2240'
    },
    stripe: {
        publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_51JpZDxCWlPpMd2zn5uGxytrjGfQmi80np3Hg5s4gS7SDx5vYciVwedJQzzRoaCOS81bTKUN9Hcj49I3MoqZHVeXG00PCADaTS3',
    },
}

export default config