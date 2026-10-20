# Kelvin Awuku-Boateng · Portfolio

A 3D personal portfolio built with plain HTML, CSS, JavaScript modules and [Three.js](https://threejs.org/) (r128, loaded from cdnjs). No build step and no dependencies to install.

- **Hero:** animated point-cloud terrain with sensor pins
- **Selected work:** draggable 3D ring of project screens, each chart drawn from that project's dataset
- **Tech stack:** glossy 3D balls you can push and grab
- **Dark and light mode:** dark by default, toggle in the top bar, choice remembered per visitor

## Folder structure

```
.
├── index.html                 # page markup
├── assets/
│   ├── css/
│   │   └── styles.css         # all styles, theme tokens (dark + light)
│   ├── img/
│   │   └── favicon.svg
│   └── js/
│       ├── main.js            # entry: lists, dialog, theme toggle, starts scenes
│       ├── theme.js           # theme state + colours used by the 3D scenes
│       ├── util.js            # small helpers
│       ├── cards.js           # paints each project's preview screen
│       ├── data/
│       │   ├── projects.js    # project text, links and chart data  ← edit projects here
│       │   └── stack.js       # tech-stack balls                    ← edit your stack here
│       └── scenes/
│           ├── terrain.js     # hero terrain
│           ├── ring.js        # project ring
│           └── stack.js       # tech-stack balls
├── .nojekyll
├── .gitignore
└── LICENSE
```

## Run locally

JavaScript modules don't load from `file://`, so serve the folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

(or `npx serve .`, or the VS Code "Live Server" extension)

## Push to GitHub

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/kelvinawukuboateng/kelvinawukuboateng.github.io.git
git push -u origin main
```

## Host it

**GitHub Pages (recommended):** In the repo, go to **Settings → Pages → Build and deployment**, set **Source** to **Deploy from a branch**, then pick branch **main** and folder **/ (root)**, and save. Every push to `main` redeploys within a minute or two.
The repo lives in the `kelvinawukuboateng` GitHub organization and is named `kelvinawukuboateng.github.io`, so the site is served at `https://kelvinawukuboateng.github.io`. All paths are relative, so the site also works under any other repo name or sub-path.

**Netlify / Vercel / Cloudflare Pages:** import the repo, leave the build command empty, set the output/publish directory to `/` (the repo root).

**Custom domain:** add a `CNAME` file with your domain (e.g. `kelvinab.dev`) and point the DNS at GitHub Pages.

## Editing

- Projects: `assets/js/data/projects.js`. Each entry has the title, summary, bullet points, metrics, stack and links. `draw` names the chart painter in `cards.js`.
- Tech stack: `assets/js/data/stack.js`. Add an object with `name`, `mark` (the short label on the ball), `color` and `group`.
- Colours and type: the tokens at the top of `assets/css/styles.css`; the 3D scene colours per theme are in `assets/js/theme.js`.
