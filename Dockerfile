# use Cypress provided image with all dependencies included
FROM cypress/base:22.15.0
# use a work directory
WORKDIR /home/node/app
# copy our test page and test files
COPY cypress.config.js package.json package-lock.json ./
COPY cypress ./cypress
# install software
RUN npm install
