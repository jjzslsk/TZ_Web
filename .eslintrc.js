// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: "babel-eslint"
    },
    env: {
        browser: true
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        "plugin:vue/essential",
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        "standard"
    ],
    // required to lint *.vue files
    plugins: ["vue"],
    // add your custom rules here
    rules: {
        // allow async-await
        "generator-star-spacing": "off",
        // allow debugger during development
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        // allow paren-less arrow functions
        "arrow-parens": 0,
        // allow async-await
        "generator-star-spacing": 0,
        // allow debugger during development
        "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
        //引号风格
        // quotes: [2, 'double', 'avoid-escape'],
        quotes: [0],
        //强制语句分号结尾
        // semi: [0, 'always'],
        semi: [0],
        //函数定义时括号前的空格
        // "space-before-function-paren": [0, "always"],

        "no-use-before-define": [2, "nofunc"], //不允许在未定义之前就使用变量

        "space-before-function-paren": [
            0,
            { anonymous: "always", named: "never" }
        ], //方法命名前不强制使用空格

        "no-mixed-spaces-and-tabs": [0, "smart-tabs"], //不强制tab 空格混用

        indent: [
            "error",
            4,
            {
                SwitchCase: 1
            }
        ], //强制一致的缩进风格

        "spaced-comment": ["warn", "always"], //多余的注释发出警告

        "no-var": 1 //使用let和const代替var
    }
};
