const { test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('../src/crawl');

describe('normalizeURL function', () => {
    test('should remove http:// from standard URLs', () => {
        expect(normalizeURL('http://example.com/path')).toBe('example.com/path');
    });

    test('should remove https:// from standard URLs', () => {
        expect(normalizeURL('https://example.com/path')).toBe('example.com/path');
    });

    test('should return the same URL if no protocol is present', () => {
        expect(normalizeURL('example.com/path')).toBe('example.com/path');
    });

    test('should correctly handle URLs with subdomains', () => {
        expect(normalizeURL('http://subdomain.example.com')).toBe('subdomain.example.com');
    });

    test('should correctly handle URLs with ports and paths', () => {
        expect(normalizeURL('http://example.com:8080/path')).toBe('example.com:8080/path');
    });

    test('should correctly handle URLs with query parameters', () => {
        expect(normalizeURL('http://example.com/path?param=value')).toBe('example.com/path?param=value');
    });

    test('should handle invalid URLs appropriately', () => {
        expect(normalizeURL('not-a-valid-url')).toBe('not-a-valid-url');
    });

    test('should handle non-URL inputs appropriately', () => {
        expect(normalizeURL(null)).toBeNull();
        expect(normalizeURL(undefined)).toBeUndefined();
    });
});

describe('getURLsFromHTML', () => {
    test('should extract URLs from the same domain', () => {
        const html = `
            <html>
                <body>
                    <a href="http://example.com/page1">Link 1</a>
                    <a href="http://example.com/page2">Link 2</a>
                    <a href="http://otherdomain.com/page3">Link 3</a>
                </body>
            </html>
        `;
        const base_url = 'http://example.com';

        const result = getURLsFromHTML(html, base_url);
        expect(result).toEqual(['example.com/page1', 'example.com/page2']);
    });

    test('should return an empty array if no relevant links are present', () => {
        const html = `
            <html>
                <body>
                    <a href="http://otherdomain.com/page1">Link 1</a>
                </body>
            </html>
        `;
        const base_url = 'http://example.com';

        const result = getURLsFromHTML(html, base_url);
        expect(result).toEqual([]);
    });
});