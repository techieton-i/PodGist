import { useEffect, useState } from "react";

type DeviceType = "mobile" | "desktop";

const getDeviceType = (breakpoint: number): DeviceType => {
  if (typeof window !== "undefined") {
    return window.innerWidth < breakpoint ? "mobile" : "desktop";
  }
  return "desktop";
};

export function useDeviceType(breakpoint = 768): {
  device: DeviceType;
  isMobile: boolean;
} {
  const [device, setDevice] = useState<DeviceType>(() =>
    getDeviceType(breakpoint)
  );

  const isMobile = device === "mobile";

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceType(breakpoint));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return { device, isMobile };
}
