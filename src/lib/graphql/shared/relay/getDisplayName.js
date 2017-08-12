/* @flow */
export default (component: any) =>
  component.displayName || component.name || 'Component';
