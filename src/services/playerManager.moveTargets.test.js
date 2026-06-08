/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import PlayerManager from './playerManager';
import targetMovement from './targetMovement';
import positionService from './positionService';

describe('PlayerManager moveTargets', () => {
	const hundred = 100;
	const ten = 10;
	const two = 2;

	describe('moveTargets', () => {
		const { moveTargets } = PlayerManager;
		const moveResult = { x: 55, y: 25 };
		const wrappedResult = { x: 55, y: 25 };

		test('moves each target using targetMovement', () => {
			const targets = [
				{ id: 'a', x: 50, y: 20, movement: { type: 'linear' }},
			];
			const state = { targets };

			jest.spyOn(targetMovement, 'compute')
				.mockReturnValue(moveResult);
			jest.spyOn(positionService, 'wrapPosition')
				.mockReturnValue(wrappedResult);

			const result = moveTargets({ state });

			expect(targetMovement.compute).toHaveBeenCalledWith(targets[0]);
			expect(positionService.wrapPosition)
				.toHaveBeenCalledWith({
					...moveResult,
					width: 0,
					height: 0,
				});
			expect(result).toEqual([{
				...targets[0],
				...wrappedResult,
			}]);
		});

		test('removes out of bounds targets when edgeBehavior is despawn', () => {
			const targets = [
				{ id: 'a', x: 50, y: hundred + ten, movement: { type: 'linear' }},
			];
			const state = { targets };

			jest.spyOn(targetMovement, 'compute')
				.mockReturnValue({ x: 50, y: hundred + ten });
			jest.spyOn(positionService, 'isOutOfBounds')
				.mockReturnValue(true);

			const result = moveTargets({ state });

			expect(result).toEqual([]);
		});

		test('keeps in bounds targets', () => {
			const targets = [
				{ id: 'a', x: 50, y: 20, movement: { type: 'linear' }},
			];
			const state = { targets };

			jest.spyOn(targetMovement, 'compute')
				.mockReturnValue({ x: 50, y: 21 });
			jest.spyOn(positionService, 'isOutOfBounds')
				.mockReturnValue(false);
			jest.spyOn(positionService, 'wrapPosition')
				.mockReturnValue({ x: 50, y: 21 });

			const result = moveTargets({ state });

			expect(result).toEqual([{
				...targets[0],
				x: 50,
				y: 21,
			}]);
		});
	});
});
