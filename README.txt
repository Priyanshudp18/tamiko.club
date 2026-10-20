Tamiko website — tamiko.club

Upload everything in this folder to the root of your hosting (Vercel, Netlify, Cloudflare Pages or Hostinger all work):
  index.html, how-it-works.html, experts.html, brands.html, faq.html, join.html, privacy.html, terms.html
  site.css, site.js, three3d.js, favicon.svg
  images/   (create this folder and put the generated images here)

Images:
  IMAGE-PROMPTS.md has one prompt per image, with the exact file name each one needs.
  Until an image is added, its slot shows a soft painted-sky placeholder with the file name.

Forms (Join the Tamiko Club, expert applications, brand enquiries):
  Right now they open the visitor's email app addressed to contact@tamiko.club.
  To collect submissions directly, open site.js and paste a form URL into  const FORM_ENDPOINT = "";
  (a Formspree endpoint, a Google Apps Script web app, or an API route on your own backend).

Before going live, add to privacy.html and terms.html:
  - your registered company name and address
  - the Grievance Officer's name
