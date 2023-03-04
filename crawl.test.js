const { test, expect } = require('@jest/globals')
const { normalizeURL } = require('./crawl.js')

test('The path should be https://wagslane.dev/path/', () => {
    expect(normalizeURL('https://wagsLane.dev/path/')).toBe(wagslane.dev/path)
})

test('The path should be https://wagslane.dev/path/', () => {
    expect(normalizeURL('http://wagslane.dev/path/')).toBe(wagslane.dev/path)
})

test('The path should be http://wagslane.dev/path/', () => {
    expect(normalizeURL('https://wagsLane.dev/path')).toBe(wagslane.dev/path)
})

test('The path should be https://wagslane.dev/path/', () => {
    expect(normalizeURL('https://wagsLAne.dEv/path')).toBe(wagslane.dev/path)
})