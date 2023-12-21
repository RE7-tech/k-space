'use client';

import { useRouter } from 'next/navigation';


const useAccessToken = () => {
    const router = useRouter();
    const urlParams = new URLSearchParams(window.location.search);

    const accessToken = urlParams.get('access_token');

    return accessToken;
};


export default useAccessToken;