import resolve from '@rollup/plugin-node-resolve';
import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'main.js',
  output: {
    file: 'dist/imi-enrichment-date.js',
    format: 'umd',
    name:'IMIEnrichmentDate'
  },
  plugins: [
    resolve(),
    buble(),
    commonjs(),
    json()
  ]
};
