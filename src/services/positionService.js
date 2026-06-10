/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable keyword-spacing */
/* eslint-disable id-match */
/* eslint-disable complexity */
import { rndBetween } from '@laufire/utils/random';

const hundred = 100;
const two = 2;

const PositionService = {

	isOutOfBounds: ({ x, y, width, height }) => {
		const halfWidth = width / two;
		const halfHeight = height / two;

		return x - halfWidth < 0 || x + halfWidth > hundred
			|| y - halfHeight < 0 || y + halfHeight > hundred;
	},

	wrapPosition: ({ x, y, width, height }) => {
		const halfWidth = width / two;
		const halfHeight = height / two;
		let wrappedX = x;
		let wrappedY = y;

		if (x - halfWidth < 0)
wrappedX = x + hundred;
		if (x + halfWidth > hundred)
wrappedX = x - hundred;
		if (y - halfHeight < 0)
wrappedY = y + hundred;
		if (y + halfHeight > hundred)
wrappedY = y - hundred;

		return { x: wrappedX, y: wrappedY };
	},

		getBulletPosition: ({ state: { flight: { x, width }},
		config: { quad }}) => {
		const flightQuarter = width / quad;

		return rndBetween(x - flightQuarter, x + flightQuarter);
	},
	limitMovement: ({ state: { flight: { width }, position: { x }}}) =>
		Math.min(hundred - (width / two), Math
			.max(x, 0 + (width / two))),

	pxToPercentage: (xPos, innerWidth) =>
		xPos / innerWidth * hundred,

	getRandomValue: (data) =>
		rndBetween(data / two, hundred - (data / two)),

	isPointInRect: ({ x, y }, { topLeft, bottomRight }) =>
		topLeft.x <= x && x <= bottomRight.x
		&& topLeft.y <= y && y <= bottomRight.y,

	getAllPoints: (rec) => ({
		topLeft: {
			x: rec.x - (rec.width / two),
			y: rec.y - (rec.height / two),
		},
		bottomRight: {
			x: rec.x + (rec.width / two),
			y: rec.y + (rec.height / two),
		},
	}),

		bouncePosition: ({ x, y, width, height }) => {
		const halfWidth = (width || 0) / two;
		const halfHeight = (height || 0) / two;

		return {
			x: Math.min(hundred - halfWidth, Math.max(halfWidth, x)),
			y: Math.min(hundred - halfHeight, Math.max(halfHeight, y)),
		};
	},

	threeDProject: ({ config, data, viewport: { width, height }}) => ({
		...data,
		x: (data.x * width / hundred) - (width / two),
		y: config.threeDProjectY,
		z: (data.y * height / hundred) - (height / two),
		width: data.width * width / hundred,
		height: data.height * height / hundred,
	}),

	getHealthProps: (context) => {
		const {
			state: { health: healthPercentage },
			config: { health },
			data,
		} = context;
		const width = data.width * healthPercentage / health;
		const XPosition = -(data.width - width) / two;

		return { width, XPosition };
	},

};

export default PositionService;
