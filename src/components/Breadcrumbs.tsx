import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbTrailItem {
  label: string;
  // Omit `path` on the final (current-page) item.
  path?: string;
}

const SITE_URL = "https://www.brandmyprofile.com";

// Renders both the visible breadcrumb trail and its matching BreadcrumbList
// JSON-LD, so the two can never drift out of sync with each other.
export default function Breadcrumbs({ items }: { items: BreadcrumbTrailItem[] }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.path ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Breadcrumb className="section-container pt-5">
        <BreadcrumbList>
          {items.map((item, index) => (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                {item.path ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
