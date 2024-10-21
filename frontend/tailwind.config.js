// tailwind.config.js
import flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
    './node_modules/flowbite/**/*.js',
    flowbite.content()
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms'), flowbite.plugin()]
};
