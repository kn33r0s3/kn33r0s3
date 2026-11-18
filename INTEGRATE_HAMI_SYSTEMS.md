# Hami Systems — integration

Hami Systems is a pop-up chat widget. One script tag puts Hami on any site.
Every surface connects to the ONE Hami gate
(`POST https://hami-sigma.vercel.app/api/hami/chat`), so all surfaces equal
one Hami. No external services, no CDN, no external fonts, no API key.
The CSS is inlined in the JS, so a single script tag is enough — no separate
CSS link is needed.

## Knee Rose site (kn33r0s3.vercel.app)

Add this one line just before `</body>` in `index.html`:

```html
<script src="https://kn33r0s3.vercel.app/hami-systems.js"></script>
```

That is the whole integration. The widget adds its own floating
"HAMI SYSTEMS" button (bottom-right), its own pop-up panel, its own styles,
and its own gate lines. It does not change any existing page content.

## Any other site (worldwide)

Add the same one line just before `</body>`:

```html
<script src="https://kn33r0s3.vercel.app/hami-systems.js"></script>
```

The script is served from `kn33r0s3.vercel.app`, so it works on any site
worldwide. The widget talks only to the Hami chat API
(`https://hami-sigma.vercel.app/api/hami/chat`) — that API is the one gate.

## Hami site (hami-sigma.vercel.app)

Same one script tag, added to the Hami site's shared layout. That
integration is a later step — it is NOT done yet. Do not claim Hami Systems
is live on the Hami site until the tag is added there and a live check
confirms the button and panel appear.

## What the widget does

- Floating "HAMI SYSTEMS" button, bottom-right, amber on black, terminal style.
- Click opens a pop-up chat panel: header "HAMI SYSTEMS", a 2px amber gate
  bar, a message area, an input row with a "$" prompt, a send button, and a
  close button. Escape closes the panel.
- Every message prints a gate line first
  (`gate: OPEN — evidence: hami engine · authorization: public chat`).
- The last 10 messages (excluding the greeting) are sent as history with
each request, so the conversation has context.
- On failure it prints the honest line
  ("hami is unreachable — the Mac tunnel may be down") and never invents a
  reply. 30-second timeout. Input is disabled while waiting.
- The greeting ("Hami Systems — ask me anything…") is shown once on first
  open and is never sent to the API.

## Files

- `hami-systems.js` — the whole widget (JS + inlined CSS). Single file,
  single script tag. No separate CSS file exists by design.
- `INTEGRATE_HAMI_SYSTEMS.md` — this file.
