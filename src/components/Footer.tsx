import { Link } from "react-router-dom";
import { Linkedin, Instagram, Mail, Phone, Star } from "lucide-react";
import { GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/seo/organization";
import { useRegion } from "@/contexts/RegionContext";
import { GA_MEASUREMENT_ID, resetConsent } from "@/lib/analyticsConsent";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";

const footerLinkClass = "transition-colors duration-200 hover:text-white hover:underline underline-offset-4";

export default function Footer() {
  const { selectedRegion } = useRegion();
  const regionPath = (suffix: string) => `/${selectedRegion.code}${suffix}`;
  // Bahrain/Oman only have a home, CV Writing, and Contact page live so far (Unit 3A) -
  // never link to their other service/utility pages until that content genuinely exists.
  const isLimitedFootprint = LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code);

  return (
    <footer data-sticky-cta-stop className="border-t border-white/15 bg-[hsl(var(--surface-ink))] text-white">
      <div className="section-container pb-8 pt-12 md:pt-16">
        <div className="mb-8 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to={`/${selectedRegion.code}`} className="mb-4 flex items-center space-x-2">
              <span className="text-xl font-bold">Brand</span>
              <span className="text-xl font-bold text-accent">MyProfile</span>
            </Link>
            <p className="mb-5 max-w-xs text-sm leading-6 text-white/75 md:text-[15px]">
              Professional CV writing, LinkedIn optimization and career support for GCC and India.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/brandmyprofile/about/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BrandMyProfile on LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/85 transition-colors duration-200 hover:border-white hover:bg-white/10 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/brandmyprofile/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BrandMyProfile on Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/85 transition-colors duration-200 hover:border-white hover:bg-white/10 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={GOOGLE_BUSINESS_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read our reviews on Google"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/85 transition-colors duration-200 hover:border-white hover:bg-white/10 hover:text-white"
              >
                <Star className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[17px] font-bold tracking-normal">Services</h3>
            <ul className="space-y-2.5 text-sm text-white/75 md:text-[15px]">
              <li><Link to={regionPath("/services/cv-writing")} className={footerLinkClass}>CV Writing</Link></li>
              {!isLimitedFootprint && (
                <>
                  <li><Link to={regionPath("/services/linkedin-makeover")} className={footerLinkClass}>LinkedIn Makeover</Link></li>
                  <li><Link to={regionPath("/services/masterclass")} className={footerLinkClass}>Masterclass</Link></li>
                  <li><Link to={regionPath("/services/career-guidance")} className={footerLinkClass}>Career Guidance</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[17px] font-bold tracking-normal">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-white/75 md:text-[15px]">
              <li><Link to={regionPath("")} className={footerLinkClass}>Home</Link></li>
              {!isLimitedFootprint && (
                <>
                  <li><Link to={regionPath("/pricing")} className={footerLinkClass}>Pricing</Link></li>
                  <li><Link to={regionPath("/success-stories")} className={footerLinkClass}>Success Stories</Link></li>
                  <li><Link to={regionPath("/about")} className={footerLinkClass}>About Us</Link></li>
                </>
              )}
              <li><Link to={regionPath("/contact")} className={footerLinkClass}>Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[17px] font-bold tracking-normal">Contact Us</h3>
            <ul className="space-y-3 text-sm font-medium text-white md:text-[15px]">
              <li className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 shrink-0 text-white/65" />
                <a href="mailto:info@brandmyprofile.com" className="min-w-0 break-words transition-colors hover:underline underline-offset-4">
                  info@brandmyprofile.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 shrink-0 text-white/65" />
                <a href="tel:+96541103254" className="transition-colors hover:underline underline-offset-4">
                  +965 41103254
                </a>
              </li>
            </ul>
            <div className="mt-5 border-t border-white/10 pt-4">
              <h4 className="mb-2 text-sm font-semibold text-white">Regions We Serve</h4>
              <p className="max-w-xs text-sm leading-6 text-white/70 md:text-[15px]">
                Kuwait · UAE · Saudi Arabia · Qatar · Bahrain · Oman · India
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 pt-5">
          <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-white/65 md:flex-row md:text-left">
            <p>&copy; {new Date().getFullYear()} BrandMyProfile. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
              <Link to="/privacy" className={footerLinkClass}>Privacy Policy</Link>
              <Link to="/terms" className={footerLinkClass}>Terms of Service</Link>
              {GA_MEASUREMENT_ID && (
                <button type="button" onClick={resetConsent} className={footerLinkClass}>Cookie settings</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Closing wordmark, anchored flush to the bottom edge and bleeding off it on purpose.
          Decorative (the linked logo above carries the name); it also gives the last links
          clearance from the floating WhatsApp button on phones. */}
      <div className="overflow-hidden" aria-hidden="true">
        <p className="footer-wordmark section-container select-none whitespace-nowrap pt-6 text-white/90">
          Brand<span className="italic text-white/45">MyProfile</span>
        </p>
      </div>
    </footer>
  );
}
