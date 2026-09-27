import type { Config } from 'tailwindcss'
export default <Partial<Config>>{ content: ['./app/**/*.{vue,ts}'], theme: { extend: { colors: { ink: '#14213d', ember: '#fca311', sand: '#f8f7f4' }, fontFamily: { display: ['Georgia', 'serif'] } } } }
