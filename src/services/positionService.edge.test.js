/* eslint-disable no-magic-numbers */
import positionService from './positionService';

describe('positionService edge handling', () => {
	const hundred = 100;
	const two = 2;
	const five = 5;
	const ten = 10;

	describe('isOutOfBounds', () => {
		test('returns false when target is within bounds', () => {
			const target = { x: 50, y: 50, width: ten, height: ten };
			const result = positionService.isOutOfBounds(target);

			expect(result).toBe(false);
		});

		test('returns true when y is below screen', () => {
			const target = { x: 50, y: hundred + ten, width: ten, height: ten };
			const result = positionService.isOutOfBounds(target);

			expect(result).toBe(true);
		});

		test('returns true when y is above screen', () => {
			const target = { x: 50, y: -ten, width: ten, height: ten };
			const result = positionService.isOutOfBounds(target);

			expect(result).toBe(true);
		});

		test('returns true when x is beyond right edge', () => {
			const target = { x: hundred + ten, y: 50, width: ten, height: ten };
			const result = positionService.isOutOfBounds(target);

			expect(result).toBe(true);
		});

		test('returns true when x is beyond left edge', () => {
			const target = { x: -ten, y: 50, width: ten, height: ten };
			const result = positionService.isOutOfBounds(target);

			expect(result).toBe(true);
		});
	});

	describe('wrapPosition', () => {
		test('wraps x from right to left', () => {
			const target = { x: hundred + 5, y: 50, width: ten };
			const result = positionService.wrapPosition(target);

			expect(result.x).toBe(5);
		});

		test('wraps x from left to right', () => {
			const target = { x: -5, y: 50, width: ten };
			const result = positionService.wrapPosition(target);

			expect(result.x).toBe(hundred - 5);
		});

		test('wraps y from bottom to top', () => {
			const target = { x: 50, y: hundred + 5, height: ten };
			const result = positionService.wrapPosition(target);

			expect(result.y).toBe(5);
		});

		test('returns same position when in bounds', () => {
			const target = { x: 50, y: 50, width: ten, height: ten };
			const result = positionService.wrapPosition(target);

			expect(result).toEqual({ x: 50, y: 50 });
		});
	});

	describe('bouncePosition', () => {
		test('bounces x from right edge', () => {
			const target = { x: 95, y: 50, width: ten };
			const result = positionService.bouncePosition(target);

			expect(result.x).toBe(hundred - (ten / two));
		});

		test('bounces x from left edge', () => {
			const target = { x: five, y: 50, width: ten };
			const result = positionService.bouncePosition(target);

			expect(result.x).toBe(ten / two);
		});

		test('returns same position when in bounds', () => {
			const target = { x: 50, y: 50, width: ten, height: ten };
			const result = positionService.bouncePosition(target);

			expect(result).toEqual({ x: 50, y: 50 });
		});
	});
});
