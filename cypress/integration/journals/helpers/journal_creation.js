Cypress.Cookies.debug(true)
class JournalCms {
  loginAsStaff() {
    cy.login_using_api(Cypress.env('JOURNAL_STAFF_EMAIL'), Cypress.env('JOURNAL_STAFF_PASSWORD')).then((resp) => {
      cy.clearCookies()
      resp.headers['set-cookie'].forEach((element) => {
        cy.log(element)
        const c = element.split(';')
        const C = c[0].split('=')
        const cName = C[0]
        const cVal = C[1]
        cy.setCookie(cName, cVal, { domain: '.edx.org' })
      })
    })
  }

  initializeStudio() {
    cy.request({
      url: 'https://stage-edx-journals.edx.org/cms/',
    })
  }

  createPage(chapterSeqNo, chapterTitle, SubTitle, contentType, bodyContent) {
    const chapterUrl = `https://stage-edx-journals.edx.org/cms/pages/add/journals/journalpage/${chapterSeqNo}/`
    cy.request({
      url: chapterUrl,
    }).then((response) => {
      const responseBody = response.body
      const el = document.createElement('html')
      el.innerHTML = responseBody
      const token = el.querySelector('input[name="csrfmiddlewaretoken"]').value
      cy.request({
        method: 'POST',
        url: chapterUrl,
        form: true,
        body: {
          csrfmiddlewaretoken: token,
          next: '',
          title: chapterTitle,
          sub_title: SubTitle,
          display_last_published_date: 'on',
          author: 'Kashif',
          'body-count': 1,
          'body-0-deleted': '',
          'body-0-order': 0,
          'body-0-type': contentType,
          'body-0-id': '',
          'body-0-value': bodyContent,
          slug: chapterTitle,
          seo_title: '',
          search_description: '',
          go_live_at: '',
          expire_at: '',
          'action-publish': 'action-publish',
        },
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7',
          Referer: chapterUrl,
          Host: 'stage-edx-journals.edx.org',
          Origin: 'https://stage-edx-journals.edx.org',
          'Upgrade-Insecure-Requests': 1,
        },
      })
    })
  }

  createSubPage(chapterSeqNo, pageSequenceNo, chapterTitle, SubTitle, contentType, bodyContent) {
    const pageUrl = `https://stage-edx-journals.edx.org/cms/pages/add/journals/journalpage/${pageSequenceNo}/`
    cy.request({
      method: 'GET',
      url: `https://stage-edx-journals.edx.org/cms/pages/${pageSequenceNo}/add_subpage/`,
      headers: {
        Referer: `https://stage-edx-journals.edx.org/cms/pages/${chapterSeqNo}/`,
        Host: 'stage-edx-journals.edx.org',
      },
    }).then((response) => {
      const responseBody = response.body
      const el = document.createElement('html')
      el.innerHTML = responseBody
      const token = el.querySelector('input[name="csrfmiddlewaretoken"]').value
      cy.request({
        method: 'POST',
        url: pageUrl,
        form: true,
        body: {
          csrfmiddlewaretoken: token,
          next: '',
          title: chapterTitle,
          sub_title: SubTitle,
          display_last_published_date: 'on',
          author: 'Kashif',
          'body-count': 1,
          'body-0-deleted': '',
          'body-0-order': 0,
          'body-0-type': contentType,
          'body-0-id': '',
          'body-0-value': bodyContent,
          slug: chapterTitle,
          seo_title: '',
          search_description: '',
          go_live_at: '',
          expire_at: '',
          'action-publish': 'action-publish',
        },
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,ur;q=0.7',
          Referer: pageUrl,
          Host: 'stage-edx-journals.edx.org',
          Origin: 'https://stage-edx-journals.edx.org',
          'Upgrade-Insecure-Requests': 1,
        },
      })
    })
  }
}

export default JournalCms
