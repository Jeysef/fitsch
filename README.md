# SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Creating a project

```bash
# create a new project in the current directory
npm init solid@latest

# create a new project in my-app
npm init solid@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## This project was created with the [Solid CLI](https://solid-cli.netlify.app)

## Testing

Tests are written with `vitest`, `@solidjs/testing-library` and `@testing-library/jest-dom` to extend expect with some helpful custom matchers.

To run them, simply start:

```sh
npm test
```


# Fit Scheduler (FITSCH)

## Abstract

This is a student's project to enhance students's experience with selecting their study programmes (programs), replace the current version and nevertheless important make me learn programming by building new Projects

# For future mainteinters

In this project I am using specific naming so I want to explain:

- **program**: programme in british english {Bachelor, Magister, Doctorat}
- **study overview** ordered by importance:
  - year: Rok {2024, ...}
  - degree: titul {Bakalář, magistr, doktor}
  - program: Studijní program {BIT, MIT, DIT} i specializace(field) {NADE, NBIO, ...}
  - grade: Ročník studia {1, 2, ...}
  - semester: Semestr {Zimní, Letní}
  - course: Předmět {IDM, IZP, ...}
  - lecture: Použito v širším slova smyslu {přednáška, cvičení, laboratoř, ...}

  **in Menu**, ordered as in the previous scheduler for better orientation:
  - year
  - semester
  - degree
  - program
  - grade
  - course


### Notes

#### Timespans
their course timespan makes no sense, 
- IDM:\
    26 hrs lectures\
    weekly 1 2 hour lecture (110 min) 13 weeks\
    = 2 * 13 = 36 ✓

- IEL:
    39 hrs lectures\
    weekly 1 2 hour & 1 1 hour lectures 13 weeks \
    = 3 * 13 = 39 ✓\
    ----\
    6 hrs seminar\
    weekly 1 1 hour (50 min) seminar 7 weeks\
    = 1 * 7 = 7 ✗\
    but \
    = (1 * 50) * 7 /60 = 5.8333333333 = 6 ✓\
    but then \
    39 hrs lectures\
    weekly 1 2 hour & 1 1 hour lectures 13 weeks \
    = (3 * 50) * 13 /60 = 32.5 ✗\
    WTF
