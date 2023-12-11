'use client';

import { useRouter } from 'next/navigation';


const useAccessToken = () => {
    const router = useRouter();
    const accessToken = router.query?.accessToken ?? null;

    return accessToken;
};


export default useAccessToken;