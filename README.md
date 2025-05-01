# Fit Scheduler (FITSCH)

<!-- [![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) -->
[![Netlify Status](https://api.netlify.com/api/v1/badges/6e19d936-ec8c-42b8-bd4a-22043d76a170/deploy-status)](https://app.netlify.com/sites/fitsch/deploys)
[![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A%2F%2Ffitsch.netlify.app)](https://fitsch.netlify.app)

A scheduler web application for planning VUT FIT lectures, built with SolidStart and TypeScript.

## Abstract

This is a student's project aimed at enhancing the experience for VUT FIT students when selecting study programs and planning their lecture schedules. It intends to potentially replace the current system and serve as a learning project.

## Features

<!-- Add a brief list of key features if known, e.g., -->
*   Browse courses by year, semester, degree, program, and grade.
*   Select courses and view potential schedules.
*   Visualize lecture timespans.
*   Save and load selected courses locally.
*   (Add more features as they are implemented)

## Project Architecture

This application is built using the [SolidStart](https://start.solidjs.com) framework, leveraging the reactivity and performance of [SolidJS](https://www.solidjs.com/).

*   **Frontend:** The user interface is built entirely with SolidJS components, styled using Tailwind CSS and UI component libraries like Kobalte (`@kobalte/core`).
*   **State Management:** SolidJS's built-in primitives (Signals, Memos, Effects) are used for managing local component state. For global or shared state, SolidJS Context API and custom providers (e.g., `SchedulerProvider`, `InstallationProvider` found in `src/providers/`) are employed. Local storage is used for persistence (`@solid-primitives/storage`).
*   **Routing:** Handled by `@solidjs/router` using a file-based routing system defined in `src/routes/`.
*   **Server Interaction:** The application fetches study data, likely through server functions or API routes defined within SolidStart (potentially in `src/server/` or `src/routes/api/`). Caching mechanisms (`src/plugins/cache.ts`) are used to optimize data fetching.
*   **Build & Development:** Vite serves as the underlying build tool, configured via `vinxi` (SolidStart's meta-framework layer).

## Core Concepts

*   **Study Overview:** The application organizes course data based on a hierarchy: Year > Semester > Degree > Program > Grade > Course > Lecture. This structure is central to browsing and selecting courses.
*   **Scheduling Logic:** too complex to explain <!-- TODO :document--->
*   **Persistence:** User selections and potentially settings are saved to the browser's Local Storage for persistence across sessions. Data validation (using Zod) is applied when loading saved data.
*   **Internationalization (i18n):** The project uses `@solid-primitives/i18n` for handling multiple languages (evident from `src/locales/` and `I18nProvider`).

## Directory Structure (`src/`)

*   `components/`: Reusable UI components (e.g., layout, buttons, dialogs).
*   `config/`: Application configuration files (e.g., color definitions).
*   `lib/`: Utility functions or shared logic not specific to components or routes.
*   `locales/`: Translation files for internationalization.
*   `packages/`: Contains local packages or modules (e.g., `solid-color`).
*   `plugins/`: Custom plugins, like the server-side cache plugin.
*   `providers/`: SolidJS Context providers for managing global state or shared functionality.
*   `routes/`: Defines the application's pages and API endpoints using file-based routing.
*   `server/`: Server-specific logic, potentially including API handlers or server functions.
*   `tests/`: Unit and integration tests using Vitest.
*   `utils/`: General utility functions.

## Getting Started

### Prerequisites

*   Node.js (>= v18 recommended, see `engines` in `package.json`)
*   pnpm (Install via `npm install -g pnpm`)

### Installation & Development

1.  Clone the repository:
    ```bash
    git clone https://github.com/Jeysef/fitsch.git
    cd fitsch
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Start the development server:
    ```bash
    pnpm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Building for Production

Solid apps are built with _presets_, which optimize your project for deployment to different environments.

*   **Node.js Server:**
    ```bash
    pnpm run build
    pnpm start
    ```
*   **Netlify:** (Preset configured in `package.json`)
    ```bash
    pnpm run build-netlify
    # Deploy the generated .netlify directory
    ```

## Testing

Tests are written with `vitest`, `@solidjs/testing-library`, and `@testing-library/jest-dom`.

*   Run tests once:
    ```bash
    pnpm test
    ```
*   Run tests in watch mode:
    ```bash
    pnpm test-watch
    ```
*   Run tests with UI:
    ```bash
    pnpm test-ui
    ```
*   Run tests with coverage (requires `@vitest/coverage-v8`):
    ```bash
    # Install coverage dependency if needed: pnpm add -D @vitest/coverage-v8
    pnpm test --coverage
    ```

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

*   Check for issues:
    ```bash
    pnpm run "lint&format"
    ```
*   Apply formatting:
    ```bash
    pnpm run format
    ```
*   Apply safe fixes:
    ```bash
    pnpm run "lint&format" --apply
    ```

## Containerization (Docker)

Build the Docker image and run the container:

```bash
docker build -t fitsch .
docker run -p 3000:3000 fitsch
```

## For Future Maintainers

### Naming Conventions

In this project, specific naming conventions are used:

*   **program**: Corresponds to 'programme' in British English (e.g., Bachelor, Master, Doctorate).
*   **study overview**: Refers to the hierarchical structure used for filtering courses, ordered by importance:
    *   year: Rok (e.g., 2024)
    *   degree: Titul (e.g., Bakalář, Magistr, Doktor)
    *   program: Studijní program (e.g., BIT, MIT, DIT) including specializations (e.g., NADE, NBIO)
    *   grade: Ročník studia (e.g., 1, 2)
    *   semester: Semestr (e.g., Zimní, Letní)
    *   course: Předmět (e.g., IDM, IZP)
    *   lecture: Used broadly for different types of classes (e.g., lecture, exercise, lab).

    **In the Menu**, the order follows the previous scheduler for familiarity:
    *   year
    *   semester
    *   degree
    *   program
    *   grade
    *   course

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

## Contributing

Contributions are welcome! Please read the `CONTRIBUTING.md` file for guidelines on how to contribute.

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.

