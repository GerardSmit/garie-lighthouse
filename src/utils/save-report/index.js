const fs = require('fs-extra');
const path = require('path');
const logger = require('../../utils/logger');
const { generateReport } = require('../../light-house');

function getReportName(date = new Date()) {
    return date.toISOString().substring(0, 19).replace(/[:-]/g, '').replace('T', '-')
}

async function saveReport(url, data, date = new Date()) {
    try {
        const report = await generateReport(url, data);
        const fileName = getReportName(date);
        return fs.outputFile(path.join(__dirname, '../../../reports', url.replace(/(^\w+:|^)\/\//, ''), `${fileName}.html`), report);
    } catch (err) {
        logger.error(`Failed to generate report for ${url}`, err);
        return Promise.reject('Failed to generate report');
    }
};

module.exports = {
    saveReport,
    getReportName
};