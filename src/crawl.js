const { JSDOM } = require('jsdom')


const normalizeURL = rawUrl => {
	if (!rawUrl || typeof rawUrl !== 'string') {
        return rawUrl;
    }
    return rawUrl.replace(/^(?:https?:\/\/)/i, "");
};

function isValidURL(href, base_url) {
    try {
        const fullUrl = new URL(href, base_url);
        const baseUrlParts = new URL(base_url);
        return href.startsWith('/') || (fullUrl.host === baseUrlParts.host);
    } catch (error) {
        return false;
    }
}

const getURLsFromHTML = (html, baseUrl) => {
	const dom = new JSDOM(html);
	const urls = [];

	const links = dom.window.document.querySelectorAll('a');
	links.forEach(link => {
		const href = link.getAttribute('href');
		if (isValidURL(href, baseUrl)) {
			urls.push(`${baseUrl}${href}`);
		}
	});
	return urls;
}

const crawlPage = async (base_url, url, pages) => {
	try {
		if (pages.includes(url)) {
			return pages;
		}
	
		const response = await fetch(url);
		if (response.headers.get('content-type') !== 'text/html')
			console.error(`${url} is not an HTML page`);
		const html = await response.text();
		const urls = getURLsFromHTML(html, base_url);
		
	
		pages.push(url);
	
		for (const url of urls) {
			await crawlPage(base_url, url, pages);
		}
		return pages;
	}
	catch (error) {
		return [];
	}
}

const printReport = pages => {
	console.log(`\n\nCrawled ${pages.length} pages:`);
	console.log(pages.sort().join('\n'));
}

module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlPage,
	printReport
}