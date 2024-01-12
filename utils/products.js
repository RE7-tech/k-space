import ProductIconCyclo from "@/public/products/cyclo.svg"
import ProductIconMoto from "@/public/products/moto.svg"
import ProductIconVSP from "@/public/products/vsp.svg"
import ProductIconHome from "@/public/products/home.svg"

const productIcons = {
    "cyclo": ProductIconCyclo,
    "moto": ProductIconMoto,
    "vsp": ProductIconVSP,
    "home": ProductIconHome
}

const products = {
    'cyclo': {
        name: 'Cyclo',
        type: 'cyclo',
        icon: ProductIconCyclo,
        enabled: true,
        newQuoteUrl: ''
    },
    'moto': {
        name: 'Moto',
        type: 'moto',
        icon: ProductIconMoto,
        enabled: true,
        newQuoteUrl: ''
    },
    'vsp': {
        name: 'Voiture sans permis',
        type: 'vsp',
        icon: ProductIconVSP,
        enabled: true,
        newQuoteUrl: ''
    },
    'mrh': {
        name: 'Habitation',
        type: 'home',
        icon: ProductIconHome,
        enabled: true,
        newQuoteUrl: ''
    },
    'home': {
        name: 'Habitation',
        type: 'home',
        icon: ProductIconHome,
        enabled: true,
        newQuoteUrl: ''
    },
    'auto': {
        name: 'Auto',
        type: 'auto',
        icon: ProductIconHome,
        enabled: false,
        newQuoteUrl: ''
    },
    'bike': {
        name: 'Vélo',
        type: 'bike',
        icon: ProductIconHome,
    },
}


export { productIcons, products };