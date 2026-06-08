/* eslint-disable padding-line-between-statements */
/* eslint-disable function-paren-newline */
/* eslint-disable no-mixed-operators */
/* eslint-disable id-match */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable no-magic-numbers */
import targetMovement from './targetMovement';

describe('targetMovement', () => {
	const hundred = 100;
	const two = 2;
	const five = 5;
	const ten = 10;
	const initialX = 50;
	const x = 50;
	const y = 20;

	describe('static', () => {
		test('returns same position', () => {
			const target = { x, y, movement: { type: 'static' }};
			const result = targetMovement.static(target);

			expect(result).toEqual({ x, y });
		});
	});

	describe('linear', () => {
		test('moves down and right', () => {
			const target = {
				x,
				y,
				movement: { speed: 2, direction: 1 },
			};
			const result = targetMovement.linear(target);

			expect(result).toEqual({ x: x + 1, y: y + 2 });
		});

		test('moves down and left', () => {
			const target = {
				x,
				y,
				movement: { speed: 3, direction: -1 },
			};
			const result = targetMovement.linear(target);

			expect(result).toEqual({ x: x - 1, y: y + 3 });
		});
	});

	describe('sine', () => {
		test('computes position using sine wave', () => {
			const target = {
				x,
				y,
				movement: {
					initialX,
					speed: 2,
					amplitude: ten,
					frequency: 0.1,
					tick: 0,
				},
			};
			const result = targetMovement.sine(target);

			expect(result.y).toEqual(y + 2);
			expect(result.x).toEqual(
				initialX + Math.sin(1 * 0.1) * ten
			);
			expect(result.movement.tick).toEqual(1);
		});
	});

	describe('zigzag', () => {
		test('moves right when direction is 1', () => {
			const target = {
				x,
				y,
				movement: {
					speed: 2,
					direction: 1,
					amplitude: ten,
					tick: 0,
				},
			};
			const result = targetMovement.zigzag(target);

			expect(result.y).toEqual(y + 2);
			expect(result.x).toEqual(x + 1);
			expect(result.movement.tick).toEqual(1);
			expect(result.movement.direction).toEqual(1);
		});

		test('bounces left when x exceeds initialX + amplitude', () => {
			const target = {
				x: initialX + ten,
				y,
				movement: {
					speed: 2,
					direction: 1,
					amplitude: ten,
					initialX,
					tick: 0,
				},
			};
			const result = targetMovement.zigzag(target);

			expect(result.y).toEqual(y + 2);
			expect(result.x).toEqual(initialX + ten);
			expect(result.movement.direction).toEqual(-1);
		});

		test('bounces right when x goes below initialX - amplitude', () => {
			const target = {
				x: initialX - ten,
				y,
				movement: {
					speed: 2,
					direction: -1,
					amplitude: ten,
					initialX,
					tick: 0,
				},
			};
			const result = targetMovement.zigzag(target);

			expect(result.y).toEqual(y + 2);
			expect(result.x).toEqual(initialX - ten);
			expect(result.movement.direction).toEqual(1);
		});
	});

	describe('compute', () => {
		test('calls static pattern', () => {
			const target = { movement: { type: 'static' }};
			jest.spyOn(targetMovement, 'static')
				.mockReturnValue({ x: ten, y: five });

			const result = targetMovement.compute(target);

			expect(targetMovement.static).toHaveBeenCalledWith(target);
			expect(result).toEqual({ x: ten, y: five });
		});

		test('calls linear pattern', () => {
			const target = { movement: { type: 'linear' }};
			jest.spyOn(targetMovement, 'linear')
				.mockReturnValue({ x: ten, y: five });

			const result = targetMovement.compute(target);

			expect(targetMovement.linear).toHaveBeenCalledWith(target);
			expect(result).toEqual({ x: ten, y: five });
		});

		test('calls sine pattern', () => {
			const target = { movement: { type: 'sine' }};
			jest.spyOn(targetMovement, 'sine')
				.mockReturnValue({ x: ten, y: five });

			const result = targetMovement.compute(target);

			expect(targetMovement.sine).toHaveBeenCalledWith(target);
			expect(result).toEqual({ x: ten, y: five });
		});

		test('calls zigzag pattern', () => {
			const target = { movement: { type: 'zigzag' }};
			jest.spyOn(targetMovement, 'zigzag')
				.mockReturnValue({ x: ten, y: five });

			const result = targetMovement.compute(target);

			expect(targetMovement.zigzag).toHaveBeenCalledWith(target);
			expect(result).toEqual({ x: ten, y: five });
		});
	});
});
