'use client';

import DesktopLayout from "@/components/DesktopLayout";
import MobileLayout from "@/components/MobileLayout";
import NeedAuthentification from "@/components/NeedAuthentification";
import config from "@/utils/config";
import { useViewport } from "react-viewport-hooks";

const DashboardLayout = ({ children }) => {

  const { vw, vh } = useViewport();

  if (!vw) return null;

  if (vw < config.breakpoints.md) {
    return (
      <>
        <MobileLayout>{children}</MobileLayout>
      </>
    );
  }

  return (
    <>
      <DesktopLayout>{children}</DesktopLayout>
    </>
  );
}

export default NeedAuthentification(DashboardLayout);