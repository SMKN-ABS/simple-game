const path = require('path');

module.exports = function override(config) {
	const extraPlugins = [
		require.resolve('@babel/plugin-proposal-optional-chaining'),
		require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
	];

	config.module.rules.forEach((rule) => {
		const oneOf = rule.oneOf || [];
		oneOf.forEach((loader) => {
			if (loader.loader && loader.loader.includes('babel-loader')) {
				if (Array.isArray(loader.exclude)) {
					loader.exclude.push(path.resolve('node_modules/@react-spring'));
				}
				else if (loader.exclude) {
					loader.exclude = [loader.exclude, path.resolve('node_modules/@react-spring')];
				}
			}
		});
	});

	const jsRule = config.module.rules
		.find((rule) => rule.oneOf && rule.oneOf.length)
		.oneOf
		.find((rule) => rule.loader && rule.loader.includes('babel-loader') && rule.exclude && rule.exclude.toString().includes('babel'));

	if (jsRule) {
		jsRule.exclude = [
			function (p) {
				if (/react-spring/.test(p)) {
					return false;
				}
				return /node_modules/.test(p);
			},
		];
		jsRule.options = jsRule.options || {};
		jsRule.options.plugins = jsRule.options.plugins || [];
		jsRule.options.plugins.push(
			require.resolve('@babel/plugin-proposal-optional-chaining'),
			require.resolve('@babel/plugin-proposal-nullish-coalescing-operator')
		);
	}

	return config;
};
