import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, FileText, Globe2, GraduationCap, Linkedin, ScanSearch, Target, Languages, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRegion, regions } from "@/contexts/RegionContext";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";
import { useChangeRegion } from "@/hooks/useChangeRegion";
import RegionFlag from "@/components/RegionFlag";
import { cn } from "@/lib/utils";
import { useLeadModal } from "@/components/lead/LeadModalContext";

// `/blog` is a global (region-less) route by design - see src/App.tsx - and must never
// be prefixed with a region segment. Every other link here targets a region-scoped page.
// `limitedRegionSafe` marks links that exist for every region, including Bahrain/Oman's
// minimal footprint (Unit 3A) - everything else is hidden there via visibleNavLinks below.
const navLinks = [
  { to: "/pricing", label: "Pricing" },
  { to: "/jobs", label: "Jobs" },
];

// Both are region-less routes (see src/App.tsx). Bahrain/Oman only get the blog, as a plain link.
const resourceLinks = [
  { to: "/blog", label: "All Articles" },
  { to: "/resources/gcc-cv-checklist", label: "GCC CV Checklist" },
];

// Grouped under one "About" menu so the top bar stays at five entries. Bahrain/Oman only
// have Contact live, so they get it as a plain link instead of a menu.
const aboutLinks = [
  { to: "/about", label: "About Us" },
  { to: "/success-stories", label: "Success Stories" },
  { to: "/contact", label: "Contact" },
];

interface MobileNavItem {
  to: string;
  label: string;
  global?: boolean;
}

// Desktop Services dropdown content: one factual line per service (no outcome claims).
const serviceMenuGroups: {
  label: string;
  items: { to: string; title: string; description: string; icon: LucideIcon; indiaOnly?: boolean }[];
}[] = [
  {
    label: "CV Writing",
    items: [
      { to: "/services/cv-writing", title: "Professional CV Writing", description: "A CV rewritten for your target role", icon: FileText },
      { to: "/services/ats-cv", title: "ATS Friendly CV", description: "Clean structure that software can read", icon: ScanSearch },
      { to: "/services/gcc-cv", title: "GCC Standard CV", description: "Format and positioning for Gulf employers", icon: Globe2 },
      { to: "/services/europass-cv", title: "Europass CV", description: "Europass-format CV for Europe", icon: Languages, indiaOnly: true },
    ],
  },
  {
    label: "LinkedIn & Career",
    items: [
      { to: "/services/linkedin-makeover", title: "LinkedIn Makeover", description: "Headline, About section and keywords", icon: Linkedin },
      { to: "/services/masterclass", title: "Masterclass", description: "Live LinkedIn workshop", icon: GraduationCap },
      { to: "/services/career-guidance", title: "Career Guidance", description: "One-to-one career direction", icon: Target },
    ],
  },
];

// Desktop nav items share one treatment: hover is a quiet tonal fill inside a static box (the
// box never moves, no animated underline); the current section carries a short red pen stroke,
// the same red as the site's redline edits. 44px tall for comfortable targets.
const navItemClass = (active: boolean) =>
  cn(
    "relative flex h-11 items-center gap-1 rounded-md px-3 text-[15px] font-medium transition-colors duration-200 ease-micro",
    "hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-foreground/[0.05] data-[state=open]:text-foreground",
    "after:pointer-events-none after:absolute after:bottom-1.5 after:left-3 after:h-[2px] after:w-5 after:rounded-full after:bg-accent after:content-['']",
    active ? "text-foreground after:opacity-100" : "text-foreground/70 after:opacity-0",
  );

// Small, understated group label (11-12px, uppercase, muted teal) - deliberately a <p>, not a
// real heading tag, matching the desktop Services dropdown's existing label convention so this
// never introduces a stray h4/h5 into the page's heading hierarchy.
function MobileNavSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 mt-6 px-3.5 text-xs font-semibold text-primary/70 first:mt-0">
      {children}
    </p>
  );
}

function MobileNavRow({
  item,
  regionPath,
  currentPath,
  onNavigate,
}: {
  item: MobileNavItem;
  regionPath: (suffix: string) => string;
  currentPath: string;
  onNavigate: () => void;
}) {
  const target = item.global ? item.to : regionPath(item.to);
  const isActive = currentPath === target;
  return (
    <Link
      to={target}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex min-h-[46px] items-center rounded-[10px] px-3.5 text-[16px] font-medium leading-tight transition-colors duration-150",
        isActive
          ? "bg-[hsl(var(--surface-teal-soft))] pl-4 font-semibold text-primary before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-primary"
          : "text-foreground hover:bg-secondary hover:text-primary",
      )}
    >
      {item.label}
    </Link>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Drives the drawer's fade + slide-in transition - mounts closed/offset, then flips to
  // visible on the next frame so the transition actually plays instead of snapping open.
  const [drawerVisible, setDrawerVisible] = useState(false);
  // `scrolled` gives the bar its hairline and shadow once the page moves; `pastHero` flips the
  // home CTA to the red primary once the hero's own red button is gone; `hidden` retracts the
  // bar while scrolling down and brings it back on any scroll up.
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { selectedRegion } = useRegion();
  const changeRegion = useChangeRegion();
  const location = useLocation();
  const { openLeadModal } = useLeadModal();
  const isHome = location.pathname.replace(/\/$/, "") === `/${selectedRegion.code}`;
  const regionPath = (suffix: string) => `/${selectedRegion.code}${suffix}`;
  // Bahrain/Oman only have a home, CV Writing, and Contact page live so far (Unit 3A) -
  // never link to their other service/utility pages until that content genuinely exists.
  const isLimitedFootprint = LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code);
  // Europass CV writing is only offered for India (Unit 3D) - see REGION_EXCLUSIVE_SUFFIXES
  // in regionAvailability.ts, which this mirrors for nav-visibility purposes.
  const isIndia = selectedRegion.code === "india";
  const bookConsultationPath = regionPath(isLimitedFootprint ? "/contact" : "/schedule");
  const visibleNavLinks = isLimitedFootprint ? [] : navLinks;

  // Grouped mobile-drawer navigation - mirrors the exact same availability rules as the
  // desktop Services dropdown and visibleNavLinks above (never a separate source of truth
  // for which routes exist per region).
  const mobileCvServices: MobileNavItem[] = isLimitedFootprint
    ? [{ to: "/services/cv-writing", label: "CV Writing" }]
    : [
        { to: "/services/cv-writing", label: "Professional CV Writing" },
        { to: "/services/ats-cv", label: "ATS Friendly CV" },
        { to: "/services/gcc-cv", label: "GCC Standard CV" },
        ...(isIndia ? [{ to: "/services/europass-cv", label: "Europass CV" }] : []),
      ];
  const mobileCareerServices: MobileNavItem[] = isLimitedFootprint
    ? []
    : [
        { to: "/services/linkedin-makeover", label: "LinkedIn Makeover" },
        { to: "/services/masterclass", label: "Masterclass" },
        { to: "/services/career-guidance", label: "Career Guidance" },
      ];
  const mobileExplore: MobileNavItem[] = [
    { to: "", label: "Home" },
    ...(isLimitedFootprint ? [] : [{ to: "/pricing", label: "Pricing" }, { to: "/jobs", label: "Jobs" }]),
    { to: "/blog", label: "Blog", global: true },
    ...(isLimitedFootprint ? [] : [{ to: "/success-stories", label: "Success Stories" }, { to: "/about", label: "About" }]),
    { to: "/contact", label: "Contact" },
  ];

  const isServicesPath = location.pathname.startsWith(`/${selectedRegion.code}/services/`);
  const isResourcesPath = location.pathname.startsWith("/blog") || location.pathname.startsWith("/resources/");
  const isAboutPath = aboutLinks.some((link) => location.pathname === regionPath(link.to));

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setPastHero(y > 480);
      const delta = y - lastY;
      // Ignore small jitters; never hide near the top, while a menu is open or while keyboard
      // focus is inside the bar (a focused link must stay visible).
      if (Math.abs(delta) < 8) return;
      const header = headerRef.current;
      const focusInside = !!header && header.contains(document.activeElement) && document.activeElement !== document.body;
      const menuOpen = !!header?.querySelector('[data-state="open"]');
      setHidden(delta > 0 && y > 320 && !focusInside && !menuOpen);
      lastY = y;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Body scroll lock while the mobile drawer is open, released as soon as it closes or the
  // component unmounts - never leaves the page permanently un-scrollable.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  // Esc closes the drawer, matching standard dialog/drawer keyboard behavior.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      setDrawerVisible(false);
      return;
    }
    const raf = requestAnimationFrame(() => setDrawerVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [mobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-transform duration-300 ease-enter motion-reduce:transition-none",
        isHome && "-mb-16",
        // Transform only while retracted. Any transform (even translate 0) makes this header the
        // containing block for the fixed mobile drawer below, pinning it under the region banner
        // and pushing its bottom CTA off screen; at rest the header must have no transform.
        hidden && !mobileMenuOpen && "-translate-y-full",
        // The mobile drawer below is a fixed z-[60] child of this header, but a sticky/
        // z-index element only stacks against siblings within its OWN parent's stacking
        // context - so the drawer's z-60 was capped by this header's z-50 and never
        // actually out-ranked the page-level WhatsAppButton (also z-50), letting it stay
        // clickable through the open drawer. Raising the header itself while the drawer is
        // open lifts the whole subtree (including the drawer) above WhatsApp correctly.
        mobileMenuOpen && "z-[60]",
      )}
    >
      {/* Opaque tonal plate (no glass over flat colour). Its content sits on the same container
          as every section, so the logo lines up with the hero headline. */}
      <div
        className={cn(
          "flex h-16 w-full items-center border-b bg-background transition-[border-color,box-shadow] duration-200",
          scrolled ? "border-border shadow-[var(--shadow-nav)]" : "border-border/60",
        )}
      >
        <nav aria-label="Main navigation" className="section-container flex w-full items-center">
          {/* Logo */}
          <Link
            to={`/${selectedRegion.code}`}
            aria-label="BrandMyProfile home"
            className="flex min-w-0 shrink-0 items-center space-x-1.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:space-x-2"
          >
            <img
              src="/brandmyprofile (20).png"
              alt=""
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-black/5 sm:h-10 sm:w-10"
            />
            <span
              className="truncate text-base font-bold text-primary sm:text-xl"
            >
              Brand
            </span>
            <span
              className="text-base font-bold text-accent sm:text-xl"
            >
              MyProfile
            </span>
          </Link>

          {/* Mobile region selector — always visible on mobile, in both top and scrolled states */}
          <DropdownMenu>
            <DropdownMenuTrigger
              data-region-selector
              aria-label={`Change region. Current region: ${selectedRegion.name}`}
              className={cn(
                "ml-auto flex h-9 shrink-0 items-center gap-1.5 rounded-[11px] border px-3 text-[13px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-[340px]:w-9 max-[340px]:justify-center max-[340px]:px-0 sm:h-auto sm:w-auto sm:justify-start sm:rounded-md sm:px-2 sm:py-1.5 sm:text-sm sm:font-medium xl:hidden",
                // 36px visual, 44px tap target
                "relative border-border/80 hover:bg-secondary after:absolute after:-inset-1 after:content-['']",
              )}
            >
              <RegionFlag code={selectedRegion.code} name={selectedRegion.name} size="md" />
              <span className="max-w-[70px] truncate max-[340px]:hidden sm:max-w-[8.5rem]">{selectedRegion.name}</span>
              <ChevronDown aria-hidden="true" className="hidden h-3.5 w-3.5 shrink-0 sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {regions.map((region) => (
                <DropdownMenuItem key={region.code} onClick={() => changeRegion(region.code)}>
                  <span className="mr-2 inline-flex"><RegionFlag code={region.code} name={region.name} size="md" /></span>
                  {region.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Center: desktop nav links, truly centered */}
          <div className="ml-8 hidden flex-1 items-center gap-0.5 xl:flex 2xl:ml-12">
            <DropdownMenu>
              <DropdownMenuTrigger className={navItemClass(isServicesPath)}>
                Services <ChevronDown aria-hidden="true" className="h-4 w-4 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[22rem] rounded-xl p-2 shadow-lg">
                {isLimitedFootprint ? (
                  <DropdownMenuItem asChild>
                    <Link to={regionPath("/services/cv-writing")}>CV Writing</Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    {serviceMenuGroups.map((group, index) => (
                      <div key={group.label} role="group" aria-label={group.label}>
                        {index > 0 && <DropdownMenuSeparator className="my-1.5" />}
                        <p className="px-3 pb-1 pt-2 text-xs font-semibold text-primary/70">{group.label}</p>
                        {group.items
                          .filter((item) => !item.indiaOnly || isIndia)
                          .map(({ to, title, description, icon: Icon }) => {
                            const target = regionPath(to);
                            const active = location.pathname === target;
                            return (
                              <DropdownMenuItem key={to} asChild className="cursor-pointer rounded-lg p-0 focus:bg-primary/5">
                                <Link to={target} aria-current={active ? "page" : undefined} className="flex items-start gap-3 px-3 py-2.5">
                                  <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-primary ring-1 ring-primary/10", active && "bg-primary text-primary-foreground")}>
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className={cn("block text-sm font-semibold leading-5", active && "text-primary")}>{title}</span>
                                    <span className="block text-[13px] leading-5 text-muted-foreground">{description}</span>
                                  </span>
                                </Link>
                              </DropdownMenuItem>
                            );
                          })}
                      </div>
                    ))}
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0 focus:bg-primary/5">
                      <Link to={regionPath("/pricing")} className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-primary">
                        Compare CV packages and pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {visibleNavLinks.map((link) => {
              const target = regionPath(link.to);
              const isActive = location.pathname === target || location.pathname.startsWith(`${target}/`);
              return (
                <Link
                  key={link.to}
                  to={target}
                  aria-current={isActive ? "page" : undefined}
                  className={navItemClass(isActive)}
                >
                  {link.label}
                </Link>
              );
            })}

            {isLimitedFootprint ? (
              <Link
                to="/blog"
                aria-current={location.pathname === "/blog" ? "page" : undefined}
                className={navItemClass(location.pathname === "/blog")}
              >
                Blog
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className={navItemClass(isResourcesPath)}>
                  Resources <ChevronDown aria-hidden="true" className="h-4 w-4 opacity-60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {resourceLinks.map((link) => (
                    <DropdownMenuItem key={link.to} asChild>
                      <Link to={link.to}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isLimitedFootprint ? (
              <Link
                to={regionPath("/contact")}
                aria-current={location.pathname === regionPath("/contact") ? "page" : undefined}
                className={navItemClass(location.pathname === regionPath("/contact"))}
              >
                Contact
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className={navItemClass(isAboutPath)}>
                  About <ChevronDown aria-hidden="true" className="h-4 w-4 opacity-60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {aboutLinks.map((link) => (
                    <DropdownMenuItem key={link.to} asChild>
                      <Link to={regionPath(link.to)}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Right: region selector + CTA (desktop) */}
          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            <DropdownMenu>
              <DropdownMenuTrigger
                data-region-selector
                aria-label={`Change region. Current region: ${selectedRegion.name}`}
                className="flex h-11 items-center gap-2 rounded-md px-3 text-[15px] font-medium text-foreground/75 transition-colors duration-200 ease-micro hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-foreground/[0.05]"
              >
                <RegionFlag code={selectedRegion.code} name={selectedRegion.name} size="md" />
                <span>{selectedRegion.name}</span>
                <ChevronDown aria-hidden="true" className="h-4 w-4 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {regions.map((region) => (
                  <DropdownMenuItem
                    key={region.code}
                    onClick={() => changeRegion(region.code)}
                  >
                    <span className="mr-2 inline-flex"><RegionFlag code={region.code} name={region.name} size="md" /></span>
                    {region.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span aria-hidden="true" className="h-6 w-px bg-border" />

            {isHome ? (
              // Teal while the hero's own red CTA is on screen; red once the hero is scrolled past.
              <Button variant={pastHero ? "cta" : "default"} className="group h-11 rounded-lg px-5 text-[15px] font-semibold shadow-none hover:shadow-none" onClick={() => openLeadModal({ trigger: "hero_cv_review" })}>
                Get My Free CV Review
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 ease-micro group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Button>
            ) : (
              <Button variant="cta" className="group h-11 rounded-lg px-5 text-[15px] font-semibold shadow-none hover:shadow-none" asChild>
                <Link to={bookConsultationPath}>
                  Book Free Consultation
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 ease-micro group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu toggle - refined to a soft teal border (never orange/accent-red,
              which is reserved for the primary CTA) once it's acting as the close button. */}
          <button
            className={cn(
              "ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:hidden",
              mobileMenuOpen
                ? "border border-primary/25 text-primary hover:border-primary/45 hover:bg-primary/5"
                : "border border-transparent",
            )}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu - full-screen drawer (100dvh): fixed top row, independently scrolling
          grouped navigation, and a pinned bottom region-switch + CTA row. Entrance is a
          subtle fade + slide-in that respects prefers-reduced-motion; Esc-to-close and body
          scroll lock are wired in the effects above. */}
      {mobileMenuOpen && (
        <div
          className={cn(
            "fixed inset-0 z-[60] flex h-[100dvh] flex-col bg-background transition-[opacity,transform] duration-[250ms] ease-out motion-reduce:transition-none xl:hidden",
            drawerVisible ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          {/* Drawer header - logo, region selector, close */}
          <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border/70 px-4">
            <Link
              to={`/${selectedRegion.code}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-w-0 shrink items-center space-x-1.5"
            >
              <img
                src="/brandmyprofile (20).png"
                alt="BrandMyProfile logo"
                className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-black/5"
              />
              <span className="truncate text-base font-bold text-primary">Brand</span>
              <span className="text-base font-bold text-accent">MyProfile</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                data-region-selector
                aria-label={`Change region. Current region: ${selectedRegion.name}`}
                className="relative ml-auto flex h-9 shrink-0 items-center gap-1.5 rounded-[11px] border border-border/80 px-3 text-[13px] font-semibold transition-colors after:absolute after:-inset-1 after:content-[''] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-[340px]:w-9 max-[340px]:justify-center max-[340px]:px-0"
              >
                <RegionFlag code={selectedRegion.code} name={selectedRegion.name} size="md" />
                <span className="max-w-[70px] truncate max-[340px]:hidden">{selectedRegion.name}</span>
                <ChevronDown aria-hidden="true" className="hidden h-3.5 w-3.5 shrink-0 sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {regions.map((region) => (
                  <DropdownMenuItem key={region.code} onClick={() => changeRegion(region.code)}>
                    <span className="mr-2 inline-flex"><RegionFlag code={region.code} name={region.name} size="md" /></span>
                    {region.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary transition-colors duration-200 hover:border-primary/45 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable grouped navigation */}
          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-2.5 pb-4 pt-2">
            <MobileNavSectionLabel>CV Writing</MobileNavSectionLabel>
            <div className="space-y-0.5">
              {mobileCvServices.map((item) => (
                <MobileNavRow
                  key={item.to}
                  item={item}
                  regionPath={regionPath}
                  currentPath={location.pathname}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>

            {mobileCareerServices.length > 0 && (
              <>
                <MobileNavSectionLabel>LinkedIn &amp; Career</MobileNavSectionLabel>
                <div className="space-y-0.5">
                  {mobileCareerServices.map((item) => (
                    <MobileNavRow
                      key={item.to}
                      item={item}
                      regionPath={regionPath}
                      currentPath={location.pathname}
                      onNavigate={() => setMobileMenuOpen(false)}
                    />
                  ))}
                </div>
              </>
            )}

            <MobileNavSectionLabel>Explore</MobileNavSectionLabel>
            <div className="space-y-0.5">
              {mobileExplore.map((item) => (
                <MobileNavRow
                  key={item.to}
                  item={item}
                  regionPath={regionPath}
                  currentPath={location.pathname}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
          </nav>

          {/* Pinned bottom area - CTA only. Region switching lives solely in the drawer's
              header row now (was previously duplicated here too) - see the "remove duplicate
              mobile region selector" cleanup. Extra bottom padding accounts for the
              home-indicator safe area on notched phones so the CTA is never flush with the
              edge, and the nav above scrolls independently so this row never covers Contact. */}
          <div className="shrink-0 border-t border-border/70 bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3.5">
            {isHome ? (
              <Button variant="cta" size="lg" className="min-h-[50px] w-full" onClick={() => {
                setMobileMenuOpen(false);
                openLeadModal({ trigger: "hero_cv_review" });
              }}>
                Get My Free CV Review
              </Button>
            ) : (
              <Button variant="cta" size="lg" className="min-h-[50px] w-full" asChild>
                <Link to={bookConsultationPath} onClick={() => setMobileMenuOpen(false)}>Book Free Consultation</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
