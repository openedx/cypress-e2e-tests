pipeline {
  
  stages {
    // Install and verify Cypress
    stage('installation') {
      steps {
        sh 'npm ci'
        sh 'npm run cy:verify'
      }
    }

    stage('run e2e tests') {
      environment {
        CYPRESS_ADMIN_USER_EMAIL = credentials('CYPRESS_ADMIN_USER_EMAIL')
        CYPRESS_ADMIN_USER_PASSWORD = credentials('CYPRESS_ADMIN_USER_PASSWORD')
        CYPRESS_LMS_USER_EMAIL = credentials('CYPRESS_LMS_USER_EMAIL')
        CYPRESS_LMS_USER_PASSWORD = credentials('CYPRESS_LMS_USER_PASSWORD')
        CYPRESS_GMAIL_ID = credentials('CYPRESS_GMAIL_ID')
        CYPRESS_GMAIL_CLIENT_ID = credentials('CYPRESS_GMAIL_CLIENT_ID')
        CYPRESS_GMAIL_CLIENT_SECRET = credentials('CYPRESS_GMAIL_CLIENT_SECRET')
        CYPRESS_GMAIL_ACCESS_TOKEN = credentials('CYPRESS_GMAIL_ACCESS_TOKEN')
        CYPRESS_GMAIL_REFRESH_TOKEN = credentials('CYPRESS_GMAIL_REFRESH_TOKEN')

      }
      steps {
        // start cypress tests
        sh 'npm run cy:run_admin_portal'
      }
    }
  }

  post {
    // Send an email in case of failure
    failure {
      mail to: "kchaudhry@edx.org", subject: "Cypress e2e Tests failure", body: "The Cypress e2e tests pipeline has failed"
    }
  }
}