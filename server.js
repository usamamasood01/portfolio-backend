const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/html-to-pdf", async (req, res) => {
  try {
    const htmlContent = "<a href='https://example.com'>Click me!</a>";

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      channel: "chrome",
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error converting HTML to PDF:", err);
    res.status(500).send("Error converting HTML to PDF");
  }
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
