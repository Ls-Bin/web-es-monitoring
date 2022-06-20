const path = require('path')
const babel = require('rollup-plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')
const pkg = require('./package.json')

const extensions = ['.js', '.ts']

const resolve = function (...args) {
  return path.resolve(__dirname, ...args)
}
const version = process.env.VERSION || require('./package.json').version

const banner =
  '/*!\n' +
  ` * web-es-monitoring v${version}\n` +
  ` * (c) 2022-${new Date().getFullYear()} Ls-Bin\n` +
  ' * Released under the MIT License.\n' +
  ' */'

module.exports = {
  input: resolve('./packages/monitoring-core/src/index.ts'),
  output: {
    file: resolve('./', pkg.main),
    format: 'esm',
  },
  plugins: [
    typescript(),
    nodeResolve({
      extensions,
      modulesOnly: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
  ],
  banner,
}
