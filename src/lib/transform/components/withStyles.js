// @flow weak
import { hoistStatics, withProps } from 'recompose';

export default styleSheet => BaseComponent => {
  const Component = hoistStatics(withProps(({
    classes: classesProp,
    innerRef,
    ...other
  }) => {
    let classes;
    if (classesProp) {
      classes = Object.keys(styleSheet).reduce((acc, key) => {
        if (classesProp[key] == null) {
          acc[key] = styleSheet[key]
        } else {
          acc[key] = `${styleSheet[key]} ${classesProp[key]}`;
        }
        return acc;
      }, {});
    } else {
      classes = styleSheet;
    }

    return {
      classes,
      ref: innerRef,
      ...other,
    };
  }))(BaseComponent);

  Component.Naked = BaseComponent;
  return Component;
}
