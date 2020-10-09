module.exports = {
    plugins: ['testing-library'],
    extends: [
        // https://github.com/facebook/create-react-app/tree/master/packages/eslint-config-react-app
        'react-app',

        // https://github.com/benmosher/eslint-plugin-import
        'plugin:import/recommended',
        'plugin:import/typescript',

        // https://prettier.io/docs/en/integrating-with-linters.html
        // https://github.com/prettier/eslint-config-prettier
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/babel',
        'prettier/flowtype',
        'prettier/react',

        // https://github.com/testing-library/eslint-plugin-testing-library
        'plugin:testing-library/recommended',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        'no-case-declarations': 'error',
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],

        // disable the base "no-redeclare" rule as it reports incorrect errors
        // see https://bit.ly/3luvr3M
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
    },
};
