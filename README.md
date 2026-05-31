# Portfolio (Static Site)

This repository contains a static portfolio site (HTML, CSS, JS, assets) ready to be hosted on GitHub Pages.

How to create the GitHub repo and push from this folder

1. Create a new repository on GitHub named `portfolio` (or choose another name).
   - Via CLI (recommended): `gh repo create <your-username>/portfolio --public` (requires `gh`)
   - Or create it via the GitHub web UI.

2. Add the remote and push (replace `<your-username>`):

```bash
git remote add origin https://github.com/<your-username>/portfolio.git
git branch -M main
git push -u origin main
```

3. Enable GitHub Pages (if not using Actions):
   - Go to the repository Settings > Pages and set the source to the `main` branch (root) and save.

This repo includes a GitHub Actions workflow to publish the repository to GitHub Pages automatically on pushes to `main`.
