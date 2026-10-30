import type { MouseEvent } from "react";

// First focusable element on every route. Pages render their own <main> without a shared id,
// so this focuses whichever <main> is on screen instead of relying on a fixed anchor.
export default function SkipLink() {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = document.querySelector("main");
    if (!main) return;
    event.preventDefault();
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
    main.scrollIntoView();
  };

  return (
    <a href="#main" onClick={skip} className="skip-link">
      Skip to main content
    </a>
  );
}
