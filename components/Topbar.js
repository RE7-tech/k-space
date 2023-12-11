import Image from 'next/image'
import logo from '@/public/logo.svg'

export default function Topbar() {

    return <>

        <div className="flex flex-row justify-between items-center bg-white p-4 border-b-2 border-blue-200">
            <div className="flex flex-row items-center cursor-pointer hover:opacity-80">
                <Image src={logo} alt="" height={31} onClick={() => window.location.href = '/'} />
            </div>
        </div>

    </>

}