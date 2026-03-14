
module.exports = function override(config, env) {
    // Add rule to allow non-fully-specified ESM modules (Webpack 5 behavior fix)
    config.module.rules.push({
        test: /\.m?js/,
        resolve: {
            fullySpecified: false,
        },
    });
    return config;
};
