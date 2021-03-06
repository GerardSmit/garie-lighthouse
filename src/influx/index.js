const influx = require('./influx');
const logger = require('../utils/logger');

/**
 * Bootstrap the database
 */
const init = async () => {
	try {
		const names = await influx.getDatabaseNames();
		if (names.indexOf('lighthouse') === -1) {
			logger.info('InfluxDB: lighthouse database does not exist. Creating database');
			await influx.createDatabase('lighthouse');
			logger.info('InfluxDB: lighthouse database created');
		}
		logger.info('InfluxDB', 'lighthouse database already exists. Skipping creation.');
	} catch (err) {
		throw new Error('Failed to initialise influx: ' + err)
	}

};

/**
 * Insert all key value pairs into the DB
 * @param {String} url - Url from the peroformance data to save
 * @param {*} data - Data to save
 */
const saveData = async (url, data) => {

	try {

		const points = Object.keys(data).reduce((points, key) => {
			if (data[key]) {
				points.push({
					measurement: key,
					tags: { url },
					fields: { value: data[key] }
				})
			}
			return points;
		}, []);


		const result = await influx.writePoints(points);
		logger.info(`Successfully saved lighthouse data for ${url}`)
		return result;

	} catch (err) {
		logger.error(`Failed to save lighthouse data for ${url}`, err)
	}

}

module.exports = {
	influx,
	init,
	saveData
};
