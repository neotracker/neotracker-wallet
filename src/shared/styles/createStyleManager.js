/* @flow */
/* :: import type { StyleManager } from 'jss-theme-reactor'; */

const amber = require('material-ui/colors/amber').default;
const blue = require('material-ui/colors/blue').default;
const blueGrey = require('material-ui/colors/blueGrey').default;
const brown = require('material-ui/colors/brown').default;
const cyan = require('material-ui/colors/cyan').default;
const deepOrange = require('material-ui/colors/deepOrange').default;
const deepPurple = require('material-ui/colors/deepPurple').default;
const green = require('material-ui/colors/green').default;
const grey = require('material-ui/colors/grey').default;
const indigo = require('material-ui/colors/indigo').default;
const lightBlue = require('material-ui/colors/lightBlue').default;
const lightGreen = require('material-ui/colors/lightGreen').default;
const lime = require('material-ui/colors/lime').default;
const orange = require('material-ui/colors/orange').default;
const pink = require('material-ui/colors/pink').default;
const purple = require('material-ui/colors/purple').default;
const red = require('material-ui/colors/red').default;
const teal = require('material-ui/colors/teal').default;
const yellow = require('material-ui/colors/yellow').default;
const createMuiTheme = require('material-ui/styles/theme').default;
const createPalette = require('material-ui/styles/palette').default;

const createClientStyleManager = require('../../lib/jss2css/createClientStyleManager');

const containerDownMDPad = {
  paddingLeft: 16,
  paddingRight: 16,
};
const containerDownMDPaddingTop = 16;
const titleDownMDNoHorizontalPad = {
  paddingBottom: 16,
  paddingTop: 16,
};
const titleDownMD = Object.assign(
  {},
  titleDownMDNoHorizontalPad,
  containerDownMDPad,
);
const containerUpMDPad = {
  paddingLeft: 24,
  paddingRight: 24,
};
const containerUpMDPaddingTop = 24;
const titleUpMDNoHorizontalPad = {
  paddingBottom: 24,
  paddingTop: 24,
};
const titleUpMD = Object.assign(
  {},
  titleUpMDNoHorizontalPad,
  containerUpMDPad,
);

const createTheme = () => {
  const theme = createMuiTheme({
    palette: createPalette({
      primary: lightGreen,
      accent: deepPurple,
      error: red,
      type: 'light',
    }),
  });
  theme.typography.button = {};
  theme.custom = {
    containerDownMDPad,
    containerUpMDPad,
    containerDownMDPaddingTop,
    containerUpMDPaddingTop,
    titleDownMDNoHorizontalPad,
    titleUpMDNoHorizontalPad,
    titleDownMD,
    titleUpMD,
    comment: {
      borderTop: `1px solid ${theme.palette.text.lightDivider}`,
      paddingBottom: 16,
      paddingTop: 16,
    },
    colors: {
      amber,
      blue,
      blueGrey,
      brown,
      cyan,
      deepOrange,
      deepPurple,
      green,
      grey,
      indigo,
      lightBlue,
      lightGreen,
      lime,
      orange,
      pink,
      purple,
      red,
      teal,
      yellow,
      common: {
        black: '#000',
        white: '#fff',
        transparent: 'rgba(0, 0, 0, 0)',
        fullBlack: 'rgba(0, 0, 0, 1)',
        darkBlack: 'rgba(0, 0, 0, 0.87)',
        lightBlack: 'rgba(0, 0, 0, 0.54)',
        minBlack: 'rgba(0, 0, 0, 0.26)',
        faintBlack: 'rgba(0, 0, 0, 0.12)',
        fullWhite: 'rgba(255, 255, 255, 1)',
        darkWhite: 'rgba(255, 255, 255, 0.87)',
        lightWhite: 'rgba(255, 255, 255, 0.54)',
      },
    },
    inputOutput: {
      row: {
        alignItems: 'center',
        display: 'flex',
        height: theme.spacing.unit * 3,
      },
    },
    transactionColors: {
      contract: {
        color: teal,
        backgroundColor: teal[500],
      },
      miner: {
        color: blueGrey,
        backgroundColor: blueGrey[400],
      },
      issue: {
        color: green,
        backgroundColor: green[600],
      },
      claim: {
        color: purple,
        backgroundColor: purple.A200,
      },
      enrollment: {
        color: indigo,
        backgroundColor: indigo.A200,
      },
      register: {
        color: amber,
        backgroundColor: deepOrange.A400,
      },
      publish: {
        color: red,
        backgroundColor: red.A200,
      },
      invocation: {
        color: blue,
        backgroundColor: blue.A200,
      },
    },
    code: {
      text: {
        fontFamily: 'Menlo,Monaco,Consolas,"Courier New",monospace',
        fontSize: theme.typography.body1.fontSize,
        fontWeight: theme.typography.body1.fontWeight,
        lineHeight: theme.typography.body1.lineHeight,
        color: theme.palette.text.primary,
      },
    },
  };
  return theme;
};

export const createContext = (opts /* :: ?: Object */) => {
  const createStyleManager =
    (opts || {}).createStyleManager || createClientStyleManager;
  const theme = createTheme();
  const styleManager = createStyleManager(theme);

  return { theme, styleManager };
};

export default () => createContext().styleManager;

/* ::
type Color = {|
  '50': string,
  '100': string,
  '200': string,
  '300': string,
  '400': string,
  '500': string,
  '600': string,
  '700': string,
  '800': string,
  '900': string,
  A100: string,
  A200: string,
  A400: string,
  A700: string,
  contrastDefaultColor: string,
|};
type Text = {
  primary: string,
  secondary: string,
  disabled: string,
  hint: string,
  icon: string,
  divider: string,
  lightDivider: string,
};
type Action = {
  active: string,
  disabled: string,
};
type Background = {
  default: string,
  paper: string,
  appBar: string,
  contentFrame: string,
  status: string,
};
// eslint-disable-next-line
type Shade = {
  text: Text,
  action: Action,
  background: Background,
};
type Font = {
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
  letterSpacing: string,
  lineHeight: number,
  color: string,
};
type Spacing = {
  unit: number,
};
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type EasingValues =
  'cubic-bezier(0.4, 0.0, 0.2, 1)' |
  'cubic-bezier(0.0, 0.0, 0.2, 1)' |
  'cubic-bezier(0.4, 0.0, 1, 1)' |
  'cubic-bezier(0.4, 0.0, 0.6, 1)';
type Easing = {
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
};
type DurationValues = 150 | 200 | 250 | 300 | 375 | 225 | 195;
type Duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  enteringScreen: 225,
  leavingScreen: 195,
};
type Custom = {
  containerDownMDPad: {
    paddingLeft: number,
    paddingRight: number,
  },
  containerUpMDPad: {
    paddingLeft: number,
    paddingRight: number,
  },
  containerDownMDPaddingTop: number,
  containerUpMDPaddingTop: number,
  titleDownMDNoHorizontalPad: {
    paddingBottom: number,
    paddingTop: number,
  },
  titleUpMDNoHorizontalPad: {
    paddingBottom: number,
    paddingTop: number,
  },
  titleDownMD: {
    paddingBottom: number,
    paddingTop: number,
    paddingLeft: number,
    paddingRight: number,
  },
  titleUpMD: {
    paddingBottom: number,
    paddingTop: number,
    paddingLeft: number,
    paddingRight: number,
  },
  comment: Object,
  colors: {
    amber: Color,
    blue: Color,
    blueGrey: Color,
    brown: Color,
    cyan: Color,
    deepOrange: Color,
    deepPurple: Color,
    green: Color,
    grey: Color,
    indigo: Color,
    lightBlue: Color,
    lightGreen: Color,
    lime: Color,
    orange: Color,
    pink: Color,
    purple: Color,
    red: Color,
    teal: Color,
    yellow: Color,
    common: {
      black: string,
      white: string,
      transparent: string,
      fullBlack: string,
      darkBlack: string,
      lightBlack: string,
      minBlack: string,
      faintBlack: string,
      fullWhite: string,
      darkWhite: string,
      lightWhite: string,
    },
  },
  inputOutput: Object,
  transactionColors: {
    contract: {
      color: Color,
      backgroundColor: string,
    },
    miner: {
      color: Color,
      backgroundColor: string,
    },
    issue: {
      color: Color,
      backgroundColor: string,
    },
    claim: {
      color: Color,
      backgroundColor: string,
    },
    enrollment: {
      color: Color,
      backgroundColor: string,
    },
    register: {
      color: Color,
      backgroundColor: string,
    },
    publish: {
      color: Color,
      backgroundColor: string,
    },
    invocation: {
      color: Color,
      backgroundColor: string,
    },
  },
  code: {
    text: {
      fontFamily: string,
      fontSize: number | string,
      fontWeight: number | string,
      lineHeight: number | string,
      color: string,
    },
  },
};

export type MUITheme = {|
  palette: {|
    type: 'light' | 'dark',
    text: {|
      primary: string,
      secondary: string,
      disabled: string,
      hint: string,
      icon: string,
      divider: string,
      lightDivider: string,
    |},
    input: {|
      bottomLine: string,
      helperText: string,
      labelText: string,
      inputText: string,
      disabled: string,
    |},
    action: {
      active: string,
      disabled: string,
    },
    background: {|
      default: string,
      paper: string,
      appBar: string,
      contentFrame: string,
      status: string,
    |},
    primary: Color,
    accent: Color,
    error: Color,
    grey: Color,
    getContrastText: (color: string) => string,
  |},
  typography: {|
    fontFamily: string,
    fontSize: number,
    fontWeightLight: number,
    fontWeightRegular: number,
    fontWeightMedium: number,
    display4: Font,
    display3: Font,
    display2: Font,
    display1: Font,
    headline: Font,
    title: Font,
    subheading: Font,
    body2: Font,
    body1: Font,
    caption: Font,
  |},
  breakpoints: {|
    keys: Array<Breakpoint>,
    values: Array<number>,
    up: (breakpoint: Breakpoint) => string,
    down: (breakpoint: Breakpoint) => string,
    between: (start: Breakpoint, end: Breakpoint) => string,
    only: (breakpoint: Breakpoint) => string,
    getWidth: (breakpoint: Breakpoint) => number,
  |},
  transitions: {|
    easing: Easing,
    duration: Duration,
    create: (props: Array<string>, options?: {
      duration?: DurationValues,
      easing?: EasingValues,
      delay?: number,
    }) => string,
    getAutoHeightDuration: (height: ?number) => number,
  |},
  zIndex: {|
    menu: number,
    appBar: number,
    drawerOverlay: number,
    navDrawer: number,
    dialogOverlay: number,
    dialog: number,
    layer: number,
    popover: number,
    snackbar: number,
    tooltip: number,
  |},
  spacing: Spacing,
  custom: Custom,
|};
export type AppStyleManager = StyleManager<MUITheme>;
*/
