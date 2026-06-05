import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { React } from 'react';
import { useThree } from '@react-three/fiber';
import redMountains from '../../images/red-mountains.png';

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

export default BackgroundMesh;
