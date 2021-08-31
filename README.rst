*****************
cypress-e2e-tests
*****************

This repo contains e2e tests written in Cypress for different edX applications

=======================
Introduction to Cypress
=======================

Cypress is a relatively new automated tests tool which is gaining popularity at a very rapid pace. (https://www.cypress.io)

Cypress newcomer tutorial: https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell

Starting tutorial videos: https://docs.cypress.io/examples/examples/tutorials.html#Best-Practices

==============
E2E Tests Repo
install==============

This repo is meant to contain multiple projects. For now there are 2 projects:

Enterprise Admin Portals (Active)

Authentication MFE

With time we will add more projects in the repo

=========================
Protocols for Test Design
=========================

We don't yet have well defined protocols for writing Cypress tests for edX application, so this work is still experimental

The first project was MIT Journals (which has since been deprecated and removed).

In the second project, Enterprise Admin Portal, the following approach was used originally:

* Page Object model is used in spite of what Cypress site says, it increases readability of code and is much easier to manage
* Instead of using arrow functions traditional named functions were used, this is done to to be able to use **this**, which is not working with arrow functions

THIS IS UNDER DEVELOPMENT AND BEING REPLACED WITH BEST PRACTICES THAT USE MODERN JAVASCRIPT. 
ALL FUTURE ADMIN PORTAL TESTS SHUOLD BE CODE REVIEWED AGAINST THE FOLLOWING GUIDELINES IN MIND: 
https://docs.cypress.io/guides/references/best-practices

* Cypress commands and helper functions are still utilized

The tests for Enterprise Admin Portal are present in following path

https://github.com/edx/cypress-e2e-tests/tree/master/cypress/integration/admin_portal

To manage multiple projects customized config files are used so user is able to run any project without making any change in the code

Config files for projects are placed here

https://github.com/edx/cypress-e2e-tests/tree/master/config


===================
Configuration Setup
===================

1. Fill in your desired Environment Variable values in `env_vars.env`. 
Example config for use with the devstack-provisioned data can be found in the file env_vars_devstack_example.env, but enterprise_id and enterprise_catalog are generated at provision time, so you'll need to replace those with your local instance. Note also that "localhost" will not work if Cypress is called from inside a docker container, so if you are using Devstack+docker, you will need to replace localhost in environment variable URLs with the local ip (see section on Docker+Devstack).



2. The following additional environment vars are required for using google api to read gmail inbox

  `CYPRESS_GMAIL_ID`

  `CYPRESS_GMAIL_CLIENT_ID`

  `CYPRESS_GMAIL_CLIENT_SECRET`

  `CYPRESS_GMAIL_ACCESS_TOKEN`

  `CYPRESS_GMAIL_REFRESH_TOKEN`

You can use the method described in the below link to get these auth tokens for any PERSONAL gmail account
(Note: if you are an edX employee, you will NOT be able to use your edX gmail for this without filing an IT ticket, as edX locks down the Google Console.)

https://developers.google.com/identity/protocols/OAuth2WebServer#creatingcred


===========================
Setup and Run Tests locally
===========================

You need to have Node.js and a n installed before using Cypress. 

From the repository root folder:

`npm install`

Source and export your configured environment file variables into your local shell for Cypress to find:

`source env_vars.env`

`export $(cut -d= -f1 env_vars.env)`

To run admin portal tests in interactive mode against edX Staging, use following command

`npm run cy:open_admin_portal`

To run Enterprise Admin portal tests in normal mode against edX Staging, use following command

`npm run cy:run_admin_portal`

To run Enterprise Admin portal tests against your local Devstack setup, use the following commands:

`npm run cy:open_admin_portal_devstack`

`npm run cy:run_admin_portal_devstack`


=============================================
Setup and Run Tests in Normal mode via Docker
=============================================

Docker setup is also available for those who want to run the tests without installing 
node locally:

1. Provide the values for environment variables in the env_vars.env

2. To run tests against edX.org STAGING, use following command in terminal:

  `docker-compose -f docker-compose.yml -f cy-run.yml up` 

3. Note that if you modify any environment variables you will need to rebuild your container with the `--build` flag to see the changes:

  Example: `docker-compose -f docker-compose.yml -f cy-run.yml up --build`

====================================================
Setup and Run Tests in Interactive Mode via Docker
====================================================

(Note: these instructions have only been tested on a Mac)

Executing tests in interactive mode from Docker requires the following extra steps:

1. As a pre-requisite you need to install XQuartz on your host machine. If you are on a Mac, you can use brew. XQuartz is also installable from <https://www.xquartz.org/>

  `brew install --cask xquartz`

2. (Steps from here down must be performed for each run) Once installed, open XQuartz using following command in terminal and leave it running for the length of your tests.

  `open -a XQuartz`

3. In the XQuartz preferences, go to the “Security” tab and make sure you’ve got “Allow connections from network clients” ticked

4. Ensure you have finished the Configuration Setup step by 
providing the values for environment variables in the env_vars.env. If you are running devstack on your host machine, you will need to use host IP address in env_vars.env.

5. Once you have XQuartz running (see step 3), locate the IP of your host machine and add it to the allowed X11 hosts by running these commands:

  `IP=$(ipconfig getifaddr en0)`

  `export IP`
  
  `/usr/X11/bin/xhost + $IP`

  Expected output should look something like `localhost being added to access control list`

6. Pass the environment variable DISPLAY to show Cypress GUI on the host system by running the following command:

  `export DISPLAY=$IP:0`

7. Bring up your docker container:
  
  For edX Staging configuration: 

  `docker-compose -f docker-compose.yml -f cy-open.yml up`

8. Note that if you modify any environment variables you will need to rebuild your container with the `--build` flag to see the changes:

  Example: `docker-compose -f docker-compose.yml -f cy-open.yml up --build`

=============
Using ES LInt
=============

ESLint is also setup in the repo, you can use it by typing following command in terminal

`npm run lint`

