# cypress-e2e-tests
Cypress E2E Tests for edX applications

---

These Tests cover Two projects


**Journals**

**Enterprise Admin Portal**

----

Run Journals tests in interactive mode

`npm run cy:open_journals`

Run Journals tests in normal mode

`npm run cy:run_journals`

Run admin portal tests in interactive mode

`npm run cy:open_admin_portal`

Run admin portal tests in normal mode

`npm run cy:run_admin_portal`

---

Following Environment Vars should be set before running the tests

Normal Journals user (any stage user)

*CYPRESS_JOURNAL_USER_EMAIL*

*CYPRESS_JOURNAL_USER_PASSWORD*

Journals Staff user (any staff on stage)

*CYPRESS_JOURNAL_STAFF_EMAIL*

8CYPRESS_JOURNAL_STAFF_PASSWORD*

Admin portal user

*CYPRESS_ADMIN_PORTAL_USER_EMAIL*

*CYPRESS_ADMIN_PORTAL_USER_PASSWORD*
