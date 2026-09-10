import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegion } from "@/contexts/RegionContext";

interface RootRedirectProps {
    to?: string; // Optional specific path to redirect to (e.g. "pricing")
}

export default function RootRedirect({ to }: RootRedirectProps) {
    const { selectedRegion, isDetecting } = useRegion();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isDetecting && selectedRegion) {
            // If a specific path is provided, append it. Otherwise just go to region root.
            const targetPath = to ? `/${selectedRegion.code}/${to}` : `/${selectedRegion.code}`;
            navigate(targetPath, { replace: true });
        }
    }, [isDetecting, selectedRegion, navigate, to]);

    // While detecting, render nothing (or a loading spinner could be added here)
    return null;
}
