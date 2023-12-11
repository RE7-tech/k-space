'use client';

import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

export default function AuthLayout({ children }) {
  return <>

    <Topbar />

    <section>

      {children}

    </section>

    <Footer />

  </>
}