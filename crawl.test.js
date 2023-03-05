const { test, expect } = require('@jest/globals')
const { normalizeURL, getURLsFromHTML } = require('./crawl.js')


test('The path should be https://wagslane.dev/path/', () => {
    expect(normalizeURL('https://wagsLane.dev/path/')).toBe('wagslane.dev/path')
})

test('The path should be https://wagslane.dev/path/', () => {
    expect(normalizeURL('http://wagslane.dev/path/')).toBe('wagslane.dev/path')
})

test('The path should be http://wagslane.dev/path/', () => {
    expect(normalizeURL('https://wagsLane.dev/path')).toBe('wagslane.dev/path')
})

test('The path should be https://wagslane.dev/path/', () => {
    expect(normalizeURL('https://wagsLAne.dEv/path')).toBe('wagslane.dev/path')
})


test('Test for Absolute URLS', () => {
    const expected = ["https://wagslane.dev/path"]
    const HTMLBody = `
    <html>
        <body>
            <a href="https://wagslane.dev/path">
            Link
            </a>
        </body>
    </html>
    `
    const received = getURLsFromHTML(HTMLBody, 'https://wagslane.dev/')
    expect(received).toEqual(expected)
})

test('Test for Relative URLS', () => {
    const expected = ["https://wagslane.dev/path"]
    const HTMLBody = `
    <html>
        <body>
            <a href="/path">
            Link
            </a>
        </body>
    </html>
    `
    const baseURL = 'https://wagslane.dev'
    const received = getURLsFromHTML(HTMLBody, baseURL)
    expect(received).toEqual(expected)
})

test('Test for Multiple Links', () => {
    const expected = ["https://wagslane.dev/path", "https://wagslane.dev/path2"]
    const HTMLBody = `
    <html>
        <body>
            <a href="/path">
            Link
            </a>
            <a href="https://wagslane.dev/path2">
            Link
            </a>
        </body>
    </html>
    `
    const baseURL = 'https://wagslane.dev'
    const received = getURLsFromHTML(HTMLBody, baseURL)
    expect(received).toEqual(expected)
})

test('Test for Invalid URLs', () => {
    const expected = []
    const HTMLBody = `
    <html>
        <body>
            <a href="invalid URL">
            invalid
            </a>
        </body>
    </html>
    `
    const baseURL = 'https://wagslane.dev'
    const received = getURLsFromHTML(HTMLBody, baseURL)
    expect(received).toEqual(expected)
})