/* @flow */
export const KeyCode = {
  BACKSPACE: 8,
  TAB: 9,
  RETURN: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  PAUSE_BREAK: 19,
  CAPS_LOCK: 20,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  INSERT: 45,
  DELETE: 46,
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  LEFT_WINDOW_KEY: 91,
  RIGHT_WINDOW_KEY: 92,
  SELECT_KEY: 93,
  NUMPAD_0: 96,
  NUMPAD_1: 97,
  NUMPAD_2: 98,
  NUMPAD_3: 99,
  NUMPAD_4: 100,
  NUMPAD_5: 101,
  NUMPAD_6: 102,
  NUMPAD_7: 103,
  NUMPAD_8: 104,
  NUMPAD_9: 105,
  MULTIPLY: 106,
  ADD: 107,
  SUBTRACT: 109,
  DECIMAL_POINT: 110,
  DIVIDE: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  NUM_LOCK: 144,
  SCROLL_LOCK: 145,
  SEMI_COLON: 186,
  EQUAL_SIGN: 187,
  COMMA: 188,
  DASH: 189,
  PERIOD: 190,
  FORWARD_SLASH: 191,
  GRAVE_ACCENT: 192,
  OPEN_BRACKET: 219,
  BACK_SLASH: 220,
  CLOSE_BRAKET: 221,
  SINGLE_QUOTE: 222,
};

export type KeyCodeType =
  8 |
  9 |
  13 |
  16 |
  17 |
  18 |
  19 |
  20 |
  27 |
  32 |
  33 |
  34 |
  35 |
  36 |
  37 |
  38 |
  39 |
  40 |
  45 |
  46 |
  48 |
  49 |
  50 |
  51 |
  52 |
  53 |
  54 |
  55 |
  56 |
  57 |
  65 |
  66 |
  67 |
  68 |
  69 |
  70 |
  71 |
  72 |
  73 |
  74 |
  75 |
  76 |
  77 |
  78 |
  79 |
  80 |
  81 |
  82 |
  83 |
  84 |
  85 |
  86 |
  87 |
  88 |
  89 |
  90 |
  91 |
  92 |
  93 |
  96 |
  97 |
  98 |
  99 |
  100 |
  101 |
  102 |
  103 |
  104 |
  105 |
  106 |
  107 |
  109 |
  110 |
  111 |
  112 |
  113 |
  114 |
  115 |
  116 |
  117 |
  118 |
  119 |
  120 |
  121 |
  122 |
  123 |
  144 |
  145 |
  186 |
  187 |
  188 |
  189 |
  190 |
  191 |
  192 |
  219 |
  220 |
  221;

export const createKeyDown = (props: Object) => (event: Object) => {
  const keyCode = event.keyCode;
  const shiftKey = event.shiftKey;
  if (keyCode === KeyCode.UP) {
    if (shiftKey) {
      if (props.onShiftUpArrow) {
        props.onShiftUpArrow(event);
      }
    } else if (props.onUpArrow) {
      props.onUpArrow(event);
    }
  } else if (keyCode === KeyCode.DOWN) {
    if (shiftKey) {
      if (props.onShiftDownArrow) {
        props.onShiftDownArrow(event);
      }
    } else if (props.onDownArrow) {
      props.onDownArrow(event);
    }
  } else if (keyCode === KeyCode.ESC && props.onEscape) {
    props.onEscape(event);
  } else if (keyCode === KeyCode.RETURN) {
    if (props.onEnter) {
      props.onEnter(event);
    }
  } else if (keyCode === KeyCode.BACKSPACE && props.onBackspace) {
    props.onBackspace(event);
  }
};

export const createKeyUp = (props: Object) => (event: Object) => {
  const keyCode = event.keyCode;
  if (keyCode === KeyCode.ESC && props.onEscapeUp) {
    props.onEscapeUp(event);
  }
};
