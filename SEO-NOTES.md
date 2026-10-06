# SEO and AI discovery improvements

Verified on 6 October 2026.

| Page | Search focus |
| --- | --- |
| Home | Selva Tree, countryside stays and events in Gurugram |
| About | Brand and Sohna/Gurugram location |
| Stay | Rooms, overnight stays and booking arrangements |
| Events | Weddings, indoor venues, lawns and private events |
| Gallery | Property photographs, distinct from illustrative stock photography |
| Contact | Reservations email, phone and enquiry process |

All six pages return HTTP 200 with a unique title, description, canonical URL,
one H1, readable body HTML, social share tags and JSON-LD in the initial response.
Content is the same for visitors and crawlers. Main headings and page guides were
updated; navigation updates metadata too. The booking email is now
booking@selvatreehotels.com.

Live checks passed for robots.txt, sitemap.xml and llms.txt. /book-now redirects
permanently to /contact, trailing slashes normalize, and an unknown URL returns
HTTP 404. Eight automated checks cover rendered pages, routing and the existing
image service. The build and Wrangler dry run passed.

## Owner follow-up

- Connect selvatreehotels.com and enable working HTTPS. Both apex and www failed
  TLS during this audit. Until then, canonicals reference the working workers.dev
  host. The origin is centrally configured in shared/seo.js.
- Confirm the actual room count, overnight capacity and property location. The
  existing copy mentions both two and four rooms and different event layouts.
  Precise capacities, ratings, prices and awards were not added to structured data.
- Confirm that existing guest testimonials and historical claims are authentic
  before relying on them as marketing evidence. They were not marked up as reviews.
- Once the final domain works, update the origin, redirect the old host, rebuild,
  and submit /sitemap.xml in Google Search Console and Bing Webmaster Tools.
- Monitor index coverage, performance and enquiry conversions. llms.txt is an
  emerging discovery convention; no ranking or AI-citation outcome is guaranteed.

Implementation details and source guidance are in README.md.
