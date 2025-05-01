# Contributing to Fit Scheduler (FITSCH)

Thank you for considering contributing to FITSCH! We welcome contributions from the community.

## How to Contribute

There are several ways you can contribute:

*   **Reporting Bugs:** If you find a bug, please open an issue on the GitHub repository. Include detailed steps to reproduce the bug, the expected behavior, and the actual behavior. Include screenshots if helpful.
*   **Suggesting Enhancements:** If you have an idea for a new feature or an improvement to an existing one, please open an issue to discuss it. Describe the feature or enhancement and why you think it would be valuable.
*   **Submitting Pull Requests:** If you want to contribute code, please follow the steps below.

## Development Setup

1.  **Fork the Repository:** Create your own fork of the `Jeysef/fitsch` repository on GitHub.
2.  **Clone Your Fork:** Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/fitsch.git
    cd fitsch
    ```
3.  **Install Dependencies:** Follow the installation instructions in the [README.md](README.md) to install `pnpm` and project dependencies.
    ```bash
    pnpm install
    ```
4.  **Create a Branch:** Create a new branch for your changes.
    ```bash
    git checkout -b feature/your-feature-name # or fix/your-bug-fix-name
    ```

## Coding Standards

*   **Language:** Please write code in TypeScript.
*   **Formatting & Linting:** This project uses [Biome](https://biomejs.dev/) for code formatting and linting. Please ensure your code adheres to the project's style guidelines by running the checks before committing.
    ```bash
    # Check for issues
    pnpm run "lint&format"

    # Apply formatting
    pnpm run format
    ```
    Configure your editor to use Biome for automatic formatting if possible.
*   **Commit Messages:** Please write clear and concise commit messages describing the changes made.

## Testing

Please ensure that any new code includes relevant tests using [Vitest](https://vitest.dev/).

*   Run tests to ensure your changes pass:
    ```bash
    pnpm test
    ```
*   If adding new features, add corresponding tests.
*   If fixing a bug, add a test that reproduces the bug and verifies the fix.

## Submitting Pull Requests

1.  **Commit Your Changes:** Make your changes and commit them with clear messages.
2.  **Push to Your Fork:** Push your changes to your forked repository.
    ```bash
    git push origin feature/your-feature-name
    ```
3.  **Open a Pull Request:** Go to the original `Jeysef/fitsch` repository on GitHub and open a pull request from your branch to the `main` branch.
4.  **Describe Your Changes:** Provide a clear description of the changes you made in the pull request description. Explain the problem you solved or the feature you added. Link to any relevant issues.
5.  **Review:** Your pull request will be reviewed, and feedback may be provided. Please respond to any comments and make necessary adjustments.

Thank you for contributing!
