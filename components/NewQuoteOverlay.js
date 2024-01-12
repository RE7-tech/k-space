import { useState, useEffect } from 'react'
import { products } from '@/utils/products'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons'


export default function NewQuoteOverlay({ onClose }) {

    const newQuote = (product) => {
        if (typeof onClose === 'function') {
            onClose()
        }
        window.location.href = product.newQuoteUrl;
    }

    return <>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-900 bg-opacity-80 h-screen w-screen z-50 flex items-center justify-center">
            <div className="text-center flex-col gap-8 relative">
                <FontAwesomeIcon icon={faTimesCircle} className="absolute top-0 right-0 text-white text-2xl cursor-pointer" onClick={() => {
                    if (typeof onClose === 'function') {
                        onClose()
                    }
                }} />
                <h4 className="text-white text-2xl font-bold mb-12">
                    Quelle catégorie ?
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    {Object.values(products).map((product, idx) => {
                        return <div onClick={() => newQuote(product)} key={idx} className={`bg-white p-4 overflow-hidden relative rounded-lg shadow-lg h-40 w-40 flex flex-col gap-4 items-center justify-center ${product.enabled ? 'cursor-pointer' : 'filter grayscale cursor-not-allowed'} hover:filter hover:border-2 hover:border-blue-900 hover:grayscale-0`}>
                            {product.enabled ? null : <div className="absolute bg-green-500 text-white text-xs top-0 right-0 p-2 w-full filter drop-shadow-md z-[999]">
                                Bientôt
                            </div>}
                            <Image src={product.icon} alt="" width={100} height={100} />
                            <p>
                                {product.name}
                            </p>
                        </div>
                    })}
                </div>
                <div className="flex justify-center mt-12">
                    <Link href={"https://klian.fr"} className='text-white cursor-pointer underline underline-offset-[3px]'>
                        Voir plus d'assurances
                    </Link>
                </div>
            </div>
        </div>
    </>

}