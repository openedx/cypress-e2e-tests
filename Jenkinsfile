pipeline {
  agent {
    // this image provides everything needed to run Cypress
    docker {
      image 'cypress/base:10'
    }
  }

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
        CYPRESS_ADMIN_PORTAL_USER_EMAIL = credentials('admin_user_email')
        CYPRESS_ADMIN_PORTAL_USER_PASSWORD = credentials('admin_user_password')
        CYPRESS_EDX_NORMAL_USER_EMAIL = credentials('normal_user_email')
        CYPRESS_EDX_NORMAL_USER_PASSWORD = credentials('normal_user_password')
        CYPRESS_GMAIL_ID = credentials('gmail_id')
        GMAIL_CLIENT_ID = credentials('gmail_client_id')
        GMAIL_CLIENT_SECRET = credentials('gmail_client_secret')
        GMAIL_ACCESS_TOKEN = credentials('gmail_access_token')
        GMAIL_REFRESH_TOKEN = credentials('gmail_refresh_token')

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