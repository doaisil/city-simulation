export const colors = {
  green: {
    25: '#e1f5e0',
    50: '#c3ebc0',
    100: '#a4e2a1',
    200: '#86d882',
    300: '#68ce62',
    400: '#4ac443',
    500: '#3ba935',
    600: '#369b31',
    700: '#318d2c',
    800: '#2c7f28',
    900: '#277123',
  },
  darkBlue: {
    25: '#fbfdff',
    50: '#f7faff',
    100: '#f5f7ff',
    200: '#e2e7f5',
    300: '#c8cee0',
    400: '#adb4cb',
    500: '#878ea8',
    600: '#535a72',
    700: '#414f6a',
    800: '#2f4362',
    900: '#0b2b51',
  },
  grey: {
    25: '#fcfcfd',
    50: '#f9fafb',
    100: '#f2f4f7',
    200: '#eaecf0',
    300: '#d0d5dd',
    400: '#98a2b3',
    500: '#667085',
    600: '#475467',
    700: '#344054',
    800: '#1d2939',
    900: '#101828',
  },
  red: {
    25: '#fbe6e6',
    50: '#f7cecd',
    100: '#f3b5b4',
    200: '#ef9c9a',
    300: '#eb8381',
    400: '#e76b68',
    500: '#e3524f',
    600: '#e03c39',
    700: '#dc2723',
    800: '#c62320',
    900: '#b01f1c',
  },
  orange: {
    25: '#fff3da',
    50: '#ffe6b6',
    100: '#ffda91',
    200: '#ffcd6d',
    300: '#ffc148',
    400: '#ffb524',
    500: '#fea800',
    600: '#e99a00',
    700: '#d48c00',
    800: '#bf7e00',
    900: '#a97000',
  },
  blue: {
    25: '#ddf2fc',
    50: '#bbe5fa',
    100: '#99d8f7',
    200: '#78cbf5',
    300: '#56bef2',
    400: '#34b1f0',
    500: '#12a4ed',
    600: '#1096d9',
    700: '#0f89c6',
    800: '#0e7bb2',
    900: '#0c6d9e',
  },
  teal: {
    25: '#e8f7f0',
    50: '#d1eee1',
    100: '#bae6d2',
    200: '#a4dec2',
    300: '#8dd6b3',
    400: '#76cda4',
    500: '#5fc595',
    600: '#4dbf89',
    700: '#41b37d',
    800: '#3aa171',
    900: '#348f64',
  },
  lightGreen: {
    25: '#edfade',
    50: '#daf5bd',
    100: '#c8f09c',
    200: '#b6eb7b',
    300: '#a3e659',
    400: '#91e138',
    500: '#7ed320',
    600: '#74c11d',
    700: '#69b01b',
    800: '#5f9e18',
    900: '#548d15',
  },
} as const;

// Semantic aliases for the simulator
export const building = {
  top: colors.grey[100],      // #f2f4f7
  left: colors.darkBlue[200], // #e2e7f5
  right: colors.grey[200],    // #eaecf0
  stroke: colors.grey[300],   // #d0d5dd
} as const;

export const road = {
  fill: colors.grey[300],     // #d0d5dd
  stroke: colors.grey[400],   // #98a2b3
} as const;

export const pin = {
  red: colors.red[500],       // #e3524f
  orange: colors.orange[500], // #fea800
  green: colors.green[400],   // #4ac443
} as const;

export const route = {
  unoptimized: colors.red[500],   // #e3524f
  warning: colors.orange[500],    // #fea800
  optimized: colors.green[400],   // #4ac443
} as const;

export const tree = {
  canopy: colors.green[50],       // #c3ebc0
  canopyDark: colors.green[100],  // #a4e2a1
  trunk: colors.grey[400],        // #98a2b3
} as const;

export const ui = {
  primary: colors.green[400],     // #4ac443
  primaryHover: colors.green[500],// #3ba935
  dark: colors.darkBlue[900],     // #0b2b51
  bg: colors.grey[50],            // #f9fafb
  white: '#ffffff',
} as const;
