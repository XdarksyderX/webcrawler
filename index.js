const { argv } = require('node:process')
const { crawlPage, printReport } = require('./src/crawl');

function main() {
	if (argv.length != 3) {
		console.log('Usage: node index.js <url>');
		return;
	}
	const url = argv[2];
	console.log(`Crawling ${url}...`);
	crawlPage(url, url, []).then(pages => {
		printReport(pages);
	});
}

main();