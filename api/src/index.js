const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const fs = require("node:fs/promises");

const config = require("./config.js");

const templateFilePath = config.TEMPLATEFILEPATH;
const updateTemplateFilePath = config.UPDATETEMPLATEFILEPATH;
const outputWalpaperPath = config.OUTPUTWALPAPERPATH;
const inputBrowserHTMLPath = config.INPUTBROWSERHTMLPATH;

async function start(date) {
	try {
		const url = `https://isha.sadhguru.org/en/wisdom/quotes/date/${date}`

		const urlResponse = await axios.get(url);

		const urlResponseData = urlResponse.data;

		// loading the html data to cheerio for parsing the html elements
		const htmlLoad = cheerio.load(urlResponseData.toString());
		// parsing the title from the html data;
		const title = htmlLoad('.css-1cw0rco').text();

		// extracting the script '#__NEXT_DATA__' for parsing the image url
		const scriptHtml = htmlLoad("#__NEXT_DATA__").html();
		
		// cleaning the invalid json in the script html for successful json parsing
		const parsedHtml = scriptHtml.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]").replace(/]\s*"\s*seoKeywords"/g, '], "seoKeywords"');

		const parsedHtmlJson = JSON.parse(parsedHtml);
		// parsing the image url from the json
		const imageUrl = parsedHtmlJson.props.pageProps.pageDataDetail.heroImage[0].value.url;

		// fetching the image data from the image url
		const imageDataResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
		// encoded the image data to base64 to insert the data directly to the
		// template file
		const imageBase64 = Buffer.from(imageDataResponse.data).toString("base64");

		// fetching the template file for upating the title and the image data. 
		const data = await fs.readFile(templateFilePath);

		// updating the template file data with the new title and the new image
		// data.
		const templateFileData = data.toString().replace("paragraph", title).replace("screenshot.png", `data:image/png;base64,${imageBase64}`);

		// writing the updated data to a new template file for the browser to
		// capture a screenshot
		await fs.writeFile(updateTemplateFilePath, templateFileData)

		//generating a screenshot of the new template file
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.goto(inputBrowserHTMLPath, { waitUntil: "load" });
		await page.setViewport({ width: 1920, height: 1024 });
		await page.screenshot({ path: outputWalpaperPath });
		await browser.close();
	} catch (err) {
		if (err.status === 404) {
			return console.log(`"${date}" quote has not been generated yet. Please try with some other dates`)
		}
		console.log("err in generating wallpaper -", err.message)
	}
}

const months = {
	0: "january",
	1: "february",
	2: "march",
	3: "april",
	4: "may",
	5: "june",
	6: "july",
	7: "august",
	8: "september",
	9: "october",
	10: "november",
	11: "december"
}

let currentDate = new Date(Date.now());

let date;
let month;
let year;

const userInput = process.argv[2];

function parseDateFromArgv(userInput) {
	if (!userInput || Number.isNaN(Number(userInput)) || userInput.length > 8 || userInput.length < 8) {
		date = currentDate.getDate();
		month = months[currentDate.getMonth()];
		year = currentDate.getFullYear();

		if (date <= 9) {
			date = `0${date.toString()}`
		}
	}
	else {
		date = userInput.slice(0, 2);
		if (userInput[2] === "0") {
			month = months[userInput.slice(3, 4) - 1]
		} else {
			month = months[userInput.slice(2, 4) - 1];
		}
		year = userInput.slice(4, 8);
	}
}

parseDateFromArgv(userInput);

let parsed_date = `${month}-${date}-${year}`;

start(parsed_date);
