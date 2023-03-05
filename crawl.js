const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)

    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`actively crawling: ${currentURL}`)
    let htmlBody = ''
    try {
        const resp = await fetch(currentURL)
        if (resp.status > 399) {
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return pages
        }
        const contentType = resp.headers.get("content-type")
        if (!contentType.includes('text/html')) {
            console.log(`non html response, content type: ${contentType}, on page ${currentURL}`)
            return pages
        }
        htmlBody = await resp.text()
    } catch (err){
        console.log(err.message)
    }

    const nextURLs = getURLsFromHTML(htmlBody, baseURL)

    for (const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages)
    }

    return pages
}


function getURLsFromHTML(htmlBody, baseURL) {
    const finLinks = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')
    for (const link of links) {
        if (link.href.slice(0, 1) === '/') {
            try {
                const urlObj = new URL(`${baseURL}${link.href}`)
                finLinks.push(`${baseURL}${link.href}`)
            } catch(err) {
                console.log('error: ${err.message}')
            }
        } else {
            try {
                const urlObj = new URL(link.href)
                finLinks.push(link.href)    
            } catch(err) {
                console.log(`error: ${err.message}`)
            }        
         }
        }
    return finLinks
}

function normalizeURL(URLString) {
    let value = new URL(URLString)
    const hostPath = `${value.hostname}${value.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) ===  '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}