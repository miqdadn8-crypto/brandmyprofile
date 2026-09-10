import { useNavigate, useLocation, useParams } from "react-router-dom";
import { regions } from "@/contexts/RegionContext";
import { isRoutedPathAvailable } from "@/contexts/regionAvailability";

/**
 * Hook to handle region switching while preserving the current route.
 * Usage: const changeRegion = useChangeRegion(); changeRegion("saudi");
 */
export function useChangeRegion() {
    const navigate = useNavigate();
    const location = useLocation();
    const { region: currentRegionSlug } = useParams<{ region: string }>();

    const changeRegion = (newRegionCode: string) => {
        // Validate target region
        const targetRegion = regions.find((r) => r.code === newRegionCode);
        if (!targetRegion) {
            console.error(`Invalid target region: ${newRegionCode}`);
            return;
        }

        // New logic: path replacement
        // If we are at /uae/services/cv-writing, we want /saudi/services/cv-writing

        // Split path: ["", "uae", "services", "cv-writing"]
        const pathSegments = location.pathname.split("/");

        // We assume the region is always the first segment [1] if we are in a RegionLayout
        // If currentRegionSlug matches pathSegments[1], we replace it.
        if (currentRegionSlug && pathSegments[1] === currentRegionSlug) {
            const suffix = pathSegments.length > 2 ? `/${pathSegments.slice(2).join("/")}` : "";
            // If the target region doesn't actually have this page yet (e.g. switching to
            // Bahrain/Oman from /pricing, which they don't have), land on its homepage
            // instead of a technically-reachable-but-not-really-built equivalent page.
            if (!isRoutedPathAvailable(newRegionCode, suffix)) {
                navigate(`/${newRegionCode}`);
                return;
            }
            pathSegments[1] = newRegionCode;
            const newPath = pathSegments.join("/");
            navigate(newPath);
        } else {
            // Fallback: If for some reason we aren't in a standard structure, 
            // just go to the new region root
            navigate(`/${newRegionCode}`);
        }
    };

    return changeRegion;
}
