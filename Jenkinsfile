pipeline {
  agent any
  tools {nodejs "node"}

    stage('build'){
        steps{
        git 'https://github.com/edx/cypress-e2e-tests.git'
        }
    }
 

    stage('run e2e tests') {
      environment {
        CYPRESS_ADMIN_USER_EMAIL = credentials('ADMIN_EMAIL')
        CYPRESS_ADMIN_USER_PASSWORD = credentials('ADMIN_PASSWORD')
        CYPRESS_LMS_USER_EMAIL = credentials('LMS_EMAIL')
        CYPRESS_LMS_USER_PASSWORD = credentials('ADMIN_PASSWORD')
        CYPRESS_GMAIL_ID = credentials('CYPRESS_GMAIL_ID')
        CYPRESS_GMAIL_CLIENT_ID = credentials('CYPRESS_GMAIL_CLIENT_ID')
        CYPRESS_GMAIL_CLIENT_SECRET = credentials('CYPRESS_GMAIL_CLIENT_SECRET')
        CYPRESS_GMAIL_ACCESS_TOKEN = credentials('CYPRESS_GMAIL_ACCESS_TOKEN')
        CYPRESS_GMAIL_REFRESH_TOKEN = credentials('CYPRESS_GMAIL_REFRESH_TOKEN')

      }
      steps {
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