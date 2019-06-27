# cypress-e2e-tests
This repo contains e2e tests written in Cypress for different edX applications

---
   
<br/>

**Introduction to Cypress**

Cypress is a relatilvely new automated tests tool which is gaining popularity at a very rapid pace

Here is the home page for Cypress if someone wants to look it up

https://www.cypress.io/

Cypress has very strong documentation so a new comer could find most of the information from their own site

https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell

Also as a starting point it would be good to go through thes tutorial videos

https://docs.cypress.io/examples/examples/tutorials.html#Best-Practices

---
<br/>

**E2E Tests Repo**

This repo is meant to contain multiple projects, for now there are two projects

MIT Journals (Deprecated)
Enterprise Admin Portals (Active)

With time we will add more projects in the repo

---
   
<br/>

**Protocols and Test Designs**

We don't yet have well defined protocols for writing Cypress tests for edX application, so this work was mostly experimental.

<br/>

The first project was MIT Journals, in this project following protocols were followed

* Page Object model was not used because Cypress site does not recommend.

* es6 Arrow functions are used in this project.

* Cypress Commands and customized utility functions are used to minimize code repetition


The tests for Journals and helper files are present in following path

https://github.com/edx/cypress-e2e-tests/tree/master/cypress/integration/journals

---

In the second project a slightly different approach is used

* Page Object model is used inspite of what Cypress site says, it increases redability of code and is much easier to manage 

* Instead of using arrow functions traditional named functions are used, this is done to to be able to use **this**, which is not working with arrow functions

* Cypress commands and helper functions are still utilized


The tests for Enterprise Admin Portal are present in following path

https://github.com/edx/cypress-e2e-tests/tree/master/cypress/integration/admin_portal

<br/>

To manage multiple projects customized config files are used so user is able to run any project without making any change in the code

Config files for both these projects are placed here

https://github.com/edx/cypress-e2e-tests/tree/master/config

---

<br/>

**Running Tests**

<br/>

You need to have Node.js installed before using Cypress.

For rest of the installations just use

`npm install`

which will install Cypress and other supporting tools

<br/>  

***Enterprise Admin Portal***


Run admin portal tests in interactive mode

`npm run cy:open_admin_portal`

Run admin portal tests in normal mode

`npm run cy:run_admin_portal`

---

Following **Environment Vars** should be set before running the tests

****Normal edX user (any stage user which does not have access on Admin Portal)****

*CYPRESS_EDX_NORMAL_USER_EMAIL*

*CYPRESS_EDX_NORMAL_USER_PASSWORD*

****Admin portal user****

*CYPRESS_ADMIN_PORTAL_USER_EMAIL*

*CYPRESS_ADMIN_PORTAL_USER_PASSWORD*

<br/>

**Lint** is also setup in the repo, you can use it by typing 

`npm run lint`

in the command prompt
