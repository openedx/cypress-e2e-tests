# cypress-e2e-tests

This repository contains end-to-end (E2E) tests written in Cypress for various Open edX applications.

---

## Introduction to Cypress

Cypress is a modern automated testing tool that is rapidly gaining popularity.

- [Cypress Home Page](https://www.cypress.io/)
- [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)
- [Cypress Tutorial Videos](https://docs.cypress.io/examples/examples/tutorials.html#Best-Practices)

Cypress has excellent documentation, so newcomers can find most information directly on their website.

---

## E2E Tests Repository

Automated tests are focused on verifying critical functionality (marked with the `@smoke` tag). Additional tests can be added for various open edX functionalities, such as validation message checks (marked with the `@regression` tag).

### Implemented E2E:

- LMS: Authentication: Registration
- LMS: Course About Page
- LMS: Course Discovery
- LMS: Course Home
- LMS: Dashboard
- Studio: Content: Outline: Unit
- Studio: Home

### E2E to be implemented:

- LMS: Course Home: Progress
- LMS: Course Home: Tools
- LMS: Instructor: Data Download
- LMS: Instructor: Membership
- Studio: Content: Outline: Unit: Component
- Studio: Settings: Advanced
- Studio: Settings: Certificates
- Studio: Settings: Schedule & Details
- Studio: In-Context Metrics

---

## Protocols for Test Design

There are not yet well-defined protocols for writing Cypress tests for Open edX applications, so this work is mostly experimental.

**Suggestion:** The test case structure should follow the guidelines of the community test documentation.

The code is generalized, allowing multiple projects to be run by setting environment variables, without modifying the code.

---

## Test Launch

### Installation

You must have Node.js installed before using Cypress.

To install Cypress and supporting tools, navigate to the project folder in your terminal and run:

```
npm install
```

---

## Test Setup

### Environment Variables

Set the following environment variables before running the tests:

#### Project variables

- `PLATFORM_NAME`
- `BASE_MFE_URL`
- `BASE_CMS_URL`

#### Required user accounts

- `ADMIN_USER_NAME` - Staff username
- `ADMIN_USER_EMAIL` - Staff email
- `ADMIN_USER_PASSWORD` - Staff password

<!-- New regular user (without any enrolled courses) -->
- `LMS_USER_NAME` - Learner username
- `LMS_USER_EMAIL` - Learner email
- `LMS_USER_PASSWORD` - Learner password
- `EXISTING_USER_FOR_BLOCK` - Username for verifying the allowed number of login attempts

#### Configurable environment variables

- `ENABLE_CREATE_NEW_COURSE_FOR_UNIT_TESTS` - Used for course creation; set to `false` after the first run
- `ENABLE_REGISTER_NEW_USER` - Set to `true` to test the registration flow
- `ENABLE_BULK_EMAIL_FLAG` - Set to `true` to verify course email settings on dashboard (ensure bulk email flag is enabled in admin)
- `ENABLE_SUPPORT_URL` - Set to `true` to verify the help link on dashboard
- `ENABLE_PROGRAMS` - Set to `true` to verify Programs
- `ENABLE_CREATE_NEW_COURSE` - Set to `true` to verify creating a new course with a new organization

---

### Running Tests

- Verify Cypress installation:  
  `npm run cy:verify`

- Open Cypress Test Runner (interactive mode):  
  `npm run cy:open`

- Run all tests headless (CLI):  
  `npm run cy:run`

- Run only smoke tests (uses grepTags plugin):  
  `npm run cy:run:smoke`

- Run only regression tests:  
  `npm run cy:run:regression`

---

### Using ESLint

ESLint is also set up in the repo. You can run it using the following command in your terminal:

```
npm run lint
```