/* eslint-disable no-unused-vars */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */

import TargetManager from '.';
import config from '../../core/config';
import * as HelperService from '../helperService';
import { keys } from '@laufire/utils/collection';
import * as random from '@laufire/utils/random';

describe('targetManager movement', () => {
	const x = Symbol('x');
	const y = 0;
	const id = Symbol('id');
	const { getTargets } = TargetManager;
	const moveType = 'linear';
	const movementConfig = config.movementTypes[moveType];

	describe('getTargets assigns movement', () => {
		const type = 'shooter';
		const typeConfig = config.targets[type];
		const { variance } = typeConfig;
		const { height, width } = typeConfig;
		const size = {
			height: height * variance,
			width: width * variance,
		};
		const sixtyFive = 65;
		const threeHundredFifty = 350;
		const color = Symbol('color');

		test('assigns movement to target', () => {
			jest.spyOn(HelperService, 'getId').mockReturnValue(id);
			jest.spyOn(HelperService, 'getVariance')
				.mockReturnValue(variance);
			jest.spyOn(random, 'rndBetween').mockReturnValue(color);
			jest.spyOn(random, 'rndValue').mockReturnValue(moveType);

			const movementTypes = keys(config.movementTypes);
			const result = getTargets({ x, y, type });

			expect(random.rndValue)
				.toHaveBeenCalledWith(movementTypes);
			expect(result.movement.type).toEqual(moveType);
			expect(result.movement).toMatchObject({
				...movementConfig,
				initialX: x,
				initialY: y,
			});
		});
	});

	describe('getMovementType', () => {
		const { getMovementType } = TargetManager;

		test('returns random movement type', () => {
			jest.spyOn(random, 'rndValue').mockReturnValue(moveType);

			const result = getMovementType();

			expect(result).toEqual(moveType);
			expect(random.rndValue)
				.toHaveBeenCalledWith(keys(config.movementTypes));
		});
	});

	describe('getMovementConfig', () => {
		const { getMovementConfig } = TargetManager;

		test('returns config for movement type', () => {
			const result = getMovementConfig(moveType);

			expect(result).toEqual(config.movementTypes[moveType]);
		});
	});
});
