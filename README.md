# cypress-e2e-tests
Cypress E2E Tests for edX applications

---

These Tests cover following projects


**Enterprise Admin Portal**

----

Run admin portal tests in interactive mode

`npm run cy:open_admin_portal`

Run admin portal tests in normal mode

`npm run cy:run_admin_portal`

---

Following Environment Vars should be set before running the tests

Normal edX user (any stage user)

*CYPRESS_EDX_NORMAL_USER_EMAIL*

*CYPRESS_EDX_NORMAL_USER_PASSWORD*

Admin portal user

*CYPRESS_ADMIN_PORTAL_USER_EMAIL*

*CYPRESS_ADMIN_PORTAL_USER_PASSWORD*
