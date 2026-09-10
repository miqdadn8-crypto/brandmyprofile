import { useEffect } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { useRegion, regions } from "@/contexts/RegionContext";
import { isRoutedPathAvailable } from "@/contexts/regionAvailability";
import NotFound from "@/pages/NotFound";

export default function RegionLayout() {
    const { region: regionParam } = useParams<{ region: string }>();
    const { selectedRegion, setSelectedRegion } = useRegion();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!regionParam) return;

        const normalizedRegionCode = regionParam.toLowerCase();
        const foundRegion = regions.find((r) => r.code === normalizedRegionCode);

        if (foundRegion) {
            // 1. Sync URL -> Context
            // Only update if context is different to avoid loops/unnecessary renders
            if (selectedRegion.code !== foundRegion.code) {
                setSelectedRegion(foundRegion);
            }
            return;
        }

        // 2. Invalid region segment.
        // A single-segment path (e.g. /xyz, /privacy, /random-invalid-page) has no
        // real sub-page to preserve - silently landing it on the Kuwait homepage would
        // mask a genuine 404 as a successful visit. Let it fall through to NotFound
        // instead (handled by the render check below).
        const pathSegments = location.pathname.split("/");
        const hasSubPath = pathSegments.length > 2 && pathSegments[2] !== "";
        if (!hasSubPath) {
            return;
        }

        // A path like /mars/pricing still names a real sub-page after the invalid
        // region segment, so correct the region rather than 404 the whole page.
        const defaultRegionCode = "kuwait";
        pathSegments[1] = defaultRegionCode;
        const newPath = pathSegments.join("/");

        console.warn(`Invalid region "${regionParam}" detected. Redirecting to ${newPath}`);
        navigate(newPath, { replace: true });
    }, [regionParam, selectedRegion, setSelectedRegion, navigate, location.pathname]);

    // If the URL region is invalid, don't render the Outlet (content) - it might rely
    // on a valid region context. A single-segment invalid path (no real sub-page to
    // correct to) renders NotFound directly instead of silently becoming the homepage.
    const isValidRegion = regions.some((r) => r.code === regionParam?.toLowerCase());

    if (!isValidRegion) {
        const pathSegments = location.pathname.split("/");
        const hasSubPath = pathSegments.length > 2 && pathSegments[2] !== "";
        if (!hasSubPath) {
            return <NotFound />;
        }
        return null; // Multi-segment path: a region-correction redirect is in flight.
    }

    // Valid region, but this specific page doesn't exist for it yet - e.g. Bahrain/Oman
    // only have home, CV Writing, and Contact live (Unit 3A). Render NotFound directly
    // rather than the real page component (no canonical/JSON-LD, noindex) and never
    // redirect elsewhere - see SEO Unit 3A.1's route-enforcement requirement.
    const pathSegments = location.pathname.split("/");
    const suffix = pathSegments.length > 2 ? `/${pathSegments.slice(2).join("/")}` : "";
    if (!isRoutedPathAvailable(regionParam!.toLowerCase(), suffix)) {
        return <NotFound />;
    }

    return <Outlet />;
}
