'use client';

import NewQuoteOverlay from "./NewQuoteOverlay";
import Sidebar from "./Sidebar";
import { useContext, useState } from "react";
import Drawer from "./Drawer";
import { DrawerContext } from "@/context/DrawerContext";
import NotificationsDrawer from "./NotificationsDrawer";

export default function DesktopLayout({ children }) {

    const { toggleDrawer, isDrawerOpen } = useContext(DrawerContext);
    const [isNewQuoteOverlayOpen, setIsNewQuoteOverlayOpen] = useState(false);

    return <>
        <div className="grid grid-cols-[180px_minmax(0,_1fr)]">
            <Sidebar onNewQuote={() => setIsNewQuoteOverlayOpen(true)} />
            <div className="overflow-y-auto max-h-screen">
                {children}
            </div>
        </div>
        {isNewQuoteOverlayOpen ? <NewQuoteOverlay onClose={() => setIsNewQuoteOverlayOpen(false)} /> : null}
        <Drawer onClose={() => toggleDrawer()} isOpen={isDrawerOpen === 'menu'} />
        <NotificationsDrawer onClose={() => toggleDrawer()} isOpen={isDrawerOpen === 'notifications'} />
    </>
}