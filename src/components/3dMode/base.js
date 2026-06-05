import { OrbitControls, useHelper, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import redMountains from '../../images/red-mountains.png';
import { React, Suspense, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import Targets from './scene/targets';
import Flight from './scene/flight';
import Bullets from './scene/bullets';
import Clouds from './scene/clouds';
import { DirectionalLightHelper } from 'three';
import OrthographicCamera from './orthographicCamera';
import Plane from './plane';
import ContactShadows from './contactShadows';
import Bgm from './bgm';
import HealthBar from './healthBar';
import Score from './score';
import AudioControl from './audioControl';
import PlayPause from './playPause';

const x = 2.5;
const y = 50;
const z = 1.5;
const bgPosY = 5;
const bgPosZ = -50;
const bgRepeatX = 3;
const bgRepeatY = 2;
const bgScaleX = 3;
const bgScaleY = 3;

const BackgroundMesh = () => {
	const { viewport } = useThree();
	const texture = useTexture(redMountains);

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(bgRepeatX, bgRepeatY);

	const meshScaleX = viewport.width * bgScaleX;
	const meshScaleY = viewport.height * bgScaleY;

	return (
		<mesh
			position={ [0, bgPosY, bgPosZ] }
			scale={ [meshScaleX, meshScaleY, 1] }
		>
			<planeGeometry args={ [1, 1] }/>
			<meshBasicMaterial map={ texture }/>
		</mesh>
	);
};
// eslint-disable-next-line max-lines-per-function
const Base = (context) => {
	const { viewport, mouse } = useThree();
	const enrichedContext = { ...context, viewport, mouse };
	const ref = useRef();

	useHelper(
		ref, DirectionalLightHelper, 1
	);

	return (
		<>
			<color attach="background" args={ ['#1a0505'] }/>
			<ambientLight color="white" intensity={ 0.3 }/>
			<directionalLight
				ref={ ref }
				position={ [x, y, z] }
				intensity={ 1 }
			/>
			<Suspense fallback={ null }>
				<Targets { ...enrichedContext }/>
				<Flight { ...enrichedContext }/>
				<Bullets { ...enrichedContext }/>
				<Clouds { ...enrichedContext }/>
				<BackgroundMesh/>
				<Plane { ...enrichedContext }/>
				<Bgm { ...enrichedContext }/>
				<HealthBar { ...enrichedContext }/>
				<Score { ...enrichedContext }/>
				<AudioControl { ...enrichedContext }/>
				<PlayPause { ...enrichedContext }/>
			</Suspense>
			<OrthographicCamera { ...enrichedContext }/>
			<ContactShadows/>
			<OrbitControls/>
		</>
	);
};

export default Base;
