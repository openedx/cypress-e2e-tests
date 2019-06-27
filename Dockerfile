# use Cypress provided image with all dependencies included
FROM cypress/base:8
# use a work directory
WORKDIR /home/node/app
# copy our test page and test files
COPY cypress.json package.json package-lock.json ./
COPY config ./config
COPY cypress ./cypress
# install software
RUN npm install