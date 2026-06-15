/* eslint-disable no-magic-numbers */
import { React } from 'react';
import { Text } from '@react-three/drei';
import { degreeToRad } from '../../services/helperService';
import PositionService from '../../services/positionService';

const meshProps = (context) => {
	const { x, z } = PositionService.threeDProject({ ...context,
		data: context.config.scorePosition });
	const degree = -90;

	return {
		rotation: [degreeToRad(degree), 0, 0], position: [x, 1, z],
	};
};

const scoreTextProps = ({ state }) => ({
	text: `Score: ${ state.score }`,
	fontSize: 0.2,
	color: 'black',
	anchorX: 'right',
});

const comboTextProps = ({ state }) => ({
	text: state.comboCount > 1 ? `🔥 ${ state.comboCount }×` : '',
	fontSize: 0.15,
	color: '#ff6600',
	anchorX: 'right',
	position: [0, -0.3, 0],
});

const Score = (context) =>
	<group { ...meshProps(context) }>
		<Text { ...scoreTextProps(context) }/>
		<Text { ...comboTextProps(context) }/>
	</group>;

export default Score;
