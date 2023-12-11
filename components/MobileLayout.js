import MobileNav from "./MobileNav";
import MobileTopBar from "./MobileTopbar";
import { DrawerContext } from "@/context/DrawerContext";
import { useContext } from "react";
import NotificationsDrawer from "./NotificationsDrawer";
import Drawer from "./Drawer";

export default function MobileLayout ({ children }) {

    const { toggleDrawer, isDrawerOpen } = useContext(DrawerContext);

    return <>

        {/* Grid mobile layout with 3 vertical columns, one for topbar, one for the content and one for the bottom navigation */}
        <div className="grid grid-cols-1 grid-rows-[56px,auto,80px] h-screen">
            <MobileTopBar />

            <div className="overflow-y-auto max-h-screen">
                {children}
            </div>

            <MobileNav />
        </div>

        <NotificationsDrawer onClose={() => toggleDrawer('notifications')} isOpen={isDrawerOpen === 'notifications'} />
        <Drawer onClose={() => toggleDrawer('menu')} isOpen={isDrawerOpen === 'menu'} />

    </>
}