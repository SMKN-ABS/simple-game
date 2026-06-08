/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-vars */
/* eslint-disable no-magic-numbers */
/* eslint-disable id-match */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
const NEGATIVE_ONE = -1;

const clamp = (
	value, min, max
) => Math.max(min, Math.min(max, value));

const computeZig = (target) => {
	const { speed, direction, amplitude, initialX, tick } = target.movement;
	const dx = direction || 1;
	const upper = initialX + amplitude;
	const lower = initialX - amplitude;
	const attemptedx = target.x + dx;
	const exceedsUpper = attemptedx > upper;
	const exceedsLower = attemptedx < lower;
	const newDirection = exceedsUpper ? NEGATIVE_ONE : exceedsLower ? 1 : dx;
	const newx = clamp(
		attemptedx, lower, upper
	);

	return {
		x: newx,
		y: target.y + speed,
		movement: {
			...target.movement,
			tick: (tick || 0) + 1,
			direction: newDirection,
		},
	};
};

const targetMovement = {
	static: (target) => ({ x: target.x, y: target.y }),

	linear: (target) => {
		const { speed, direction } = target.movement;

		return {
			x: target.x + (direction || 0),
			y: target.y + speed,
		};
	},

	sine: (target) => {
		const { initialX, speed, amplitude, frequency, tick } = target.movement;
		const newTick = (tick || 0) + 1;

		return {
			x: initialX + Math.sin(newTick * frequency) * amplitude,
			y: target.y + speed,
			movement: {
				...target.movement,
				tick: newTick,
			},
		};
	},

	zigzag: (target) => {
		const { speed, direction, amplitude, initialX, tick } = target.movement;
		const dx = direction || 1;
		const upper = initialX + amplitude;
		const lower = initialX - amplitude;
		const attemptedX = target.x + dx;
		const exceedsUpper = attemptedX > upper;
		const exceedsLower = attemptedX < lower;
		const newDirection = exceedsUpper
			? -1
			: exceedsLower
				? 1
				: dx;
		const newX = exceedsUpper
			? upper
			: exceedsLower
				? lower
				: attemptedX;

		return {
			x: newX,
			y: target.y + speed,
			movement: {
				...target.movement,
				tick: (tick || 0) + 1,
				direction: newDirection,
			},
		};
	},

	compute: (target) => {
		const type = (target.movement || {}).type || 'static';

		return (targetMovement[type] || targetMovement.static)(target);
	},
};

export default targetMovement;
