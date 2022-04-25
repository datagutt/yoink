module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['plugin:react/recommended', 'eslint:recommended', 'prettier', 'xo', 'xo-typescript', 'xo-react'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
		project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
		allowAutomaticSingleRunInference: true,
		tsconfigRootDir: __dirname,
		warnOnUnsupportedTypeScriptVersion: false,
		EXPERIMENTAL_useSourceOfProjectReferenceRedirect: false,
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		'@typescript-eslint/comma-dangle': 'off',
		'@typescript-eslint/triple-slash-reference': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/ban-types': 'off',
		// Warn on variables not following naming convention
		// https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/naming-convention.md
		'@typescript-eslint/naming-convention': [
			'warn',
			// Defaults from @typescript-eslint/eslint-plugin
			// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md#options
			{
				selector: 'default',
				format: ['camelCase'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow',
			},
			{
				selector: 'variable',
				format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow',
			},
			{
				selector: 'typeLike',
				format: ['PascalCase'],
			},
			// Allow PascalCase for functions (React components)
			{
				selector: 'function',
				format: ['camelCase', 'PascalCase'],
				leadingUnderscore: 'allow',
			},
			{
				selector: 'property',
				format: null,
			},
			{
				selector: 'parameter',
				format: ['camelCase', 'snake_case', 'PascalCase'],
			},
			{
				selector: 'enumMember',
				format: ['PascalCase', 'UPPER_CASE'],
			}
		],
		'react/function-component-definition': 'off',
		'react/boolean-prop-naming': 'off',
		'react/jsx-tag-spacing': 'off',
		'react/exhaustive-deps': 'off',
		'linebreak-style': 0,
		'operator-linebreak': 0,
	},
	ignorePatterns: ['**/*.js', 'dist', 'node_modules', 'coverage', '*.d.ts'],
};
