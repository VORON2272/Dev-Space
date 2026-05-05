# 🚀 Dev Space

<p align="right">
  <a href="README.ru.md">🇷🇺 Русский</a> | <b>🇬🇧 English</b>
</p>

<p align="center">
  <img src="https://projectencelada.ru/extensions/resourcemanager/uploads/1766330801_Purple%20and%20Black%20Bold%20Typographic%20Web%20Design%20Logo%20(2).png" width="600">
</p>

## About the project
**Dev Space** is a simple browser-based website builder that helps beginner developers quickly set up a personal portfolio. 

The idea is straightforward: you customize the layout and sections (info, projects, skills) directly in your browser. Once you're done, you download a zip archive containing clean `HTML` and `CSS` files with just one click. From there, you can easily deploy it to GitHub Pages, Vercel, or any other free hosting provider.

---

## Why use it?
- Allows beginners to build a neat portfolio quickly without writing boilerplate code from scratch.
- Generates clean, readable code that can be easily modified later.
- Saves a lot of time when creating a personal website.

---

## Features
- **Visual Editor:** Customize the appearance without touching the code.
- **Pre-built Blocks:** Hero section, "About Me", Tech Stack, Project Cards, Contacts.
- **Live Preview:** See exactly how your final site will look in real-time.
- **Export:** Generate and download fully configured `index.html` and `style.css` files.
- **Responsive Design:** The generated templates look great on mobile devices right out of the box.

---

## Under the Hood (Tech Stack)
This project runs entirely on the client side in the browser. No backend is used.

- **HTML5 / CSS3** — For the builder's interface and the underlying structure of the exported sites.
- **JavaScript** — Handles all the logic: UI interactions, real-time preview, and generating the downloadable files (using Blob/File API).

**Upcoming Features:**
- Draft saving via `localStorage` so you don't lose your progress if you close the tab.
- Additional customization themes.