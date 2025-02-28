import type { Args, AnyFramework, ArgsEnhancer } from '@storybook/csf';
import { action } from '../index';

const isInInitialArgs = (name: string, initialArgs: Args) =>
  typeof initialArgs[name] === 'undefined' && !(name in initialArgs);

/**
 * Automatically add action args for argTypes whose name
 * matches a regex, such as `^on.*` for react-style `onClick` etc.
 */

export const inferActionsFromArgTypesRegex: ArgsEnhancer<AnyFramework> = (context) => {
  const {
    initialArgs,
    argTypes,
    parameters: { actions },
  } = context;
  if (!actions || actions.disable || !actions.argTypesRegex || !argTypes) {
    return {};
  }

  const argTypesRegex = new RegExp(actions.argTypesRegex);
  const argTypesMatchingRegex = Object.entries(argTypes).filter(
    ([name]) => !!argTypesRegex.test(name)
  );

  return argTypesMatchingRegex.reduce((acc, [name, argType]) => {
    if (isInInitialArgs(name, initialArgs)) {
      acc[name] = action(name);
    }
    return acc;
  }, {} as Args);
};

/**
 * Add action args for list of strings.
 */
export const addActionsFromArgTypes: ArgsEnhancer<AnyFramework> = (context) => {
  const {
    initialArgs,
    argTypes,
    parameters: { actions },
  } = context;
  if (actions?.disable || !argTypes) {
    return {};
  }

  const argTypesWithAction = Object.entries(argTypes).filter(([name, argType]) => !!argType.action);

  return argTypesWithAction.reduce((acc, [name, argType]) => {
    if (isInInitialArgs(name, initialArgs)) {
      acc[name] = action(typeof argType.action === 'string' ? argType.action : name);
    }
    return acc;
  }, {} as Args);
};
