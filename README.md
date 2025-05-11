# cypress-e2e-tests

This repo contains e2e tests written in Cypress for different Open edX applications

---
---

## Introduction to Cypress

Cypress is a relatively new automated tests tool which is gaining popularity at a very rapid pace

Here is the home page for Cypress if someone wants to look it up

<https://www.cypress.io/>

Cypress has very strong documentation so a new comer could find most of the information from their own site

<https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell>

Also as a starting point it would be good to go through these tutorial videos

<https://docs.cypress.io/examples/examples/tutorials.html#Best-Practices>

---
---

## E2E Tests Repo

This repo is meant to contain a sample for e2e tests:

Authentication MFE (Active)

With time we will add more projects in the repo

---
---

## Protocols for Test Design

We don't yet have well defined protocols for writing Cypress tests for Open edX application, so this work was mostly experimental

The first project was MIT Journals (which has since been deprecated and removed).

In the second project, Authentication MFE, the following approach was used:

* Page Object model is used in spite of what Cypress site says, it increases readability of code and is much easier to manage

* Cypress commands and helper functions are still utilized

The tests for Authentication MFE are present in following path

<https://github.com/openedx/cypress-e2e-tests/tree/master/cypress/e2e/auth>

The code is intended to be generalized and multiple projects can be run via setting env variables and without any code modifications.

---
---

## Test Setup

### Installations

You need to have Node.js installed before using Cypress.

For rest of the installations move to project folder in command prompt and type

`npm install`

which will install Cypress and other supporting tools

### Nix

You can use Nix to get a development env almost without any manual installation

#### DevBox
```
devbox shell
```
or
```
devbox run cy:run
```

Devbox already includes the default env variables to run agains a community sandbox:
```
cat devbox.json
...
  "env": {
    "LMS_BASE_URL": "https://teak.demo.edly.io/",
    "CYPRESS_LMS_USER_NAME": "admin",
    "CYPRESS_LMS_USER_PASS": "admin"
  },
...
```


#### Flake
```
nix develop
```

---

### Environment Variables

Following Environment Vars should be set before running the tests

`LMS_BASE_URL`

_Note_: The above is a base LMS URL - it's an entry point for all tests

`CYPRESS_LMS_USER_NAME`

`CYPRESS_LMS_USER_EMAIL`

`CYPRESS_LMS_USER_PASSWORD`

_Note_: The above are credentials for a normal Open edX user who does not have access to admin portal

`CYPRESS_ADMIN_USER_NAME`

`CYPRESS_ADMIN_USER_EMAIL`

`CYPRESS_ADMIN_USER_PASSWORD`

_Note_: The above are credentials for an admin portal valid user

Following environment vars would be required for using google api to read gmail inbox

`CYPRESS_GMAIL_ID`

`CYPRESS_GMAIL_CLIENT_ID`

`CYPRESS_GMAIL_CLIENT_SECRET`

`CYPRESS_GMAIL_ACCESS_TOKEN`

`CYPRESS_GMAIL_REFRESH_TOKEN`

_Note_: You can use the method descibed in the below link to get these auth tokens for any personal gmail account

<https://developers.google.com/identity/protocols/OAuth2WebServer#creatingcred>

---

### Run Tests

To run admin portal tests in interactive mode use following command

`npm run cy:open`

To run admin portal tests in normal mode use following command

`npm run cy:run`

---

### Using ES LInt

ESLint is also setup in the repo, you can use it by typing following command in terminal

`npm run lint`

---

## Docker Setup

Docker setup is also available for those who want to run the tests without doing any installations

To run the tests in Docker

* Provide the values for environment variables in the env_vars.env
* Use following command in terminal
        `docker-compose -f docker-compose.yml -f cy-run.yml up`

---

## Running Tests in Interactive Mode using Docker

You can also execute tests in interactive mode directly from Docker, for that you would need to do
some extra steps

As a pre-requisite you need to install XQuartz using following command

`brew cask install xquartz`

or install it directly from <https://www.xquartz.org/>

### To configure XQuartz

* Open XQuartz using following command in terminal
  * `open -a XQuartz`
* In the XQuartz preferences, go to the “Security” tab and make sure you’ve got “Allow connections from network clients” ticked

### To run the tests

* Provide the values for environment variables in the env_vars.env
* Grab the IP of the host machine and add it to the allowed X11 hosts by running these commands
  * `IP=$(ipconfig getifaddr en0)`
  * `/usr/X11/bin/xhost + $IP`
* Pass the environment variable DISPLAY to show Cypress GUI on the host system
  * `DISPLAY=$IP:0`
* Use following command in terminal
  * `docker-compose -f docker-compose.yml -f cy-open.yml up`
