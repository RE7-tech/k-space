'use client';

import { useEffect } from "react";
import { redirect } from "next/navigation";
import useAuth from "@/hooks/useAuth";


export default function isAuth (Component) {
  return function isAuth(props) {
    const auth = useAuth()

    useEffect(() => {
      if (!auth.user) {
        return redirect('/auth/login');
      }
    }, [auth.user])

    if (!auth.user) {
      return null
    }

    return <Component {...props} />
  }
}