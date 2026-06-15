import React from 'react';
import blast from '../images/score-icon.png';

const Score = (context) => {
	const { state: { score, comboCount }} = context;

	return <div role="score-card" className="container">
		<img role="damage-icon" src={ blast } className="flightDamage"/>
		<span role="score" className="score">
			{score} </span>
		{ comboCount > 1 && <span role="combo" className="combo-badge">
			🔥 { comboCount }×
		</span> }
	</div>;
};

export default Score;
