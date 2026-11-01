/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: '#F5F7F5', sf: '#FFFFFF', s2: '#E2E8E3', tx: '#252B27', t2: '#68736C', ac: '#536E60', bd: '#E1E6E2', er: '#A8432F' },
    fontFamily: { sans: ['"IBM Plex Sans"', '"Source Sans 3"', 'system-ui', 'sans-serif'] },
    borderRadius: { md: '7px', lg: '9px' } } },
}
