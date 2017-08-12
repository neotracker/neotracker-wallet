/* @flow */
// TODO: Replace with public export
import {
  type CacheConfig,
} from 'react-relay/lib/RelayCombinedEnvironmentTypes';
import {
  type Disposable,
  type Environment,
  type GraphQLTaggedNode,
  type OperationSelector,
  type RelayContext,
  type Snapshot,
  type Variables,
} from 'react-relay';
import React from 'react';

import _ from 'lodash';
import { getContext } from 'recompose';

import { type Log } from '~/src/lib/log/shared';

import getDisplayName from './getDisplayName';

type ReadyState = {
  error: ?Error,
  props: ?Object,
  retry: ?() => void,
};
type Props<LoggingContext> = {
  cacheConfig?: ?CacheConfig,
  environment: Environment,
  query: ?GraphQLTaggedNode,
  render: (
    readyState: ReadyState,
    prevState: ?ReadyState
  ) => ?React.Element<*>,
  variables: ?Variables,
  skipNullVariables: boolean,
  asyncContinue: boolean,
  log: Log<*, *, *, LoggingContext>,
  loggingContext: LoggingContext,
};
type State = {
  readyState: ReadyState,
  lastProps: ?Object,
};

function getDefaultState(): ReadyState {
  return {
    error: null,
    props: null,
    retry: null,
  };
}

/**
 * @public
 *
 * Orchestrates fetching and rendering data for a single view or view hierarchy:
 * - Fetches the query/variables using the given network implementation.
 * - Normalizes the response(s) to that query, publishing them to the given
 *   store.
 * - Renders the pending/fail/success states with the provided render function.
 * - Subscribes for updates to the root data and re-renders with any changes.
 */
 // $FlowFixMe
class ReactRelayQueryRenderer<LoggingContext> extends React.Component {
  _mounted: boolean;
  _operation: ?OperationSelector;
  _pendingFetch: ?Disposable;
  _relayContext: RelayContext;
  _rootSubscription: ?Disposable;
  _selectionReference: ?Disposable;
  _latestState: ?State;

  props: Props<LoggingContext>;
  state: State;
  static defaultProps = {
    cacheConfig: undefined,
  };

  constructor(props: Props<LoggingContext>, context: Object) {
    super((props: any), context);
    this._mounted = false;
    this._pendingFetch = null;
    this._rootSubscription = null;
    this._selectionReference = null;
    this._handleQueryAndVariables(props, (state) => {
      this.state = state;
    });
  }

  componentDidMount(): void {
    this._mounted = true;
    if (this._latestState != null) {
      // eslint-disable-next-line
      this._setState(this._latestState);
    }
  }

  // $FlowFixMe
  componentWillReceiveProps(nextProps: Props<LoggingContext>): void {
    if (
      nextProps.query !== this.props.query ||
      nextProps.environment !== this.props.environment ||
      !_.isEqual(nextProps.variables, this.props.variables)
    ) {
      this._handleQueryAndVariables(nextProps, this._setState.bind(this));
    }
  }

  _handleQueryAndVariables(
    props: Props<LoggingContext>,
    setState: (state: Object) => void,
  ): void {
    const { skipNullVariables } = props;
    let { query, variables } = props;
    // TODO (#16225453) QueryRenderer works with old and new environment, but
    // the flow typing doesn't quite work abstracted.
    const environment: Environment = props.environment;
    let operation = null;
    if (
      query && (
        !skipNullVariables ||
        variables != null
      )
    ) {
      const {
        createOperationSelector,
        getOperation,
      } = environment.unstable_internal;
      query = getOperation(query);
      operation = createOperationSelector(query, variables || {});
      variables = operation.variables;
    } else {
      this._release();
    }

    this._operation = operation;
    this._relayContext = {
      environment,
      variables: variables || {},
    };

    // if (operation && environment.check(operation.root)) {
      // this.state = {
        // readyState: {
          // error: null,
          // props: environment.lookup(operation.fragment).data,
          // retry: null,
        // },
      // };
    // } else
    let stateSet = false;
    if (query) {
      setState({ readyState: getDefaultState() });
      stateSet = true;
    }

    if (operation) {
      const readyState = this._fetch(operation, props.cacheConfig);
      if (readyState) {
        setState({ readyState });
        stateSet = true;
      }
    }

    if (!stateSet) {
      setState({
        readyState: {
          error: null,
          props: {},
          retry: () => {
            this._fetch(operation, { ...props.cacheConfig, force: true });
          },
        },
      });
    }
  }

  componentWillUnmount(): void {
    this._release();
    this._mounted = false;
  }

  // $FlowFixMe
  shouldComponentUpdate(nextProps: Props<LoggingContext>, nextState: State): boolean {
    return (
      nextProps.render !== this.props.render ||
      nextState.readyState !== this.state.readyState
    );
  }

  _release(): void {
    if (this._pendingFetch) {
      this._pendingFetch.dispose();
      this._pendingFetch = null;
    }
    if (this._rootSubscription) {
      this._rootSubscription.dispose();
      this._rootSubscription = null;
    }
    if (this._selectionReference) {
      // TODO: GC better
      // this._selectionReference.dispose();
      this._selectionReference = null;
    }
  }

  _fetch(
    operation: OperationSelector,
    cacheConfig: ?CacheConfig,
    onComplete?: () => void,
  ): ReadyState {
    const { environment } = this._relayContext;

    // Immediately retain the results of the new query to prevent relevant data
    // from being freed. This is not strictly required if all new data is
    // fetched in a single step, but is necessary if the network could attempt
    // to incrementally load data (ex: multiple query entries or incrementally
    // loading records from disk cache).
    const nextReference = environment.retain(operation.root);

    let readyState = getDefaultState();
    let snapshot: ?Snapshot; // results of the root fragment
    let isFunctionReturned = false;
    const onCompleted = () => {
      this._pendingFetch = null;
      if (onComplete) {
        onComplete();
      }
    };
    const onError = (error) => {
      this.props.log({
        event: 'GRAPHQL_FETCH_ERROR',
        meta: { type: 'error', error: (error: Error) },
        context: (this.props.loggingContext: LoggingContext),
      });
      readyState = {
        error,
        props: null,
        retry: () => {
          this._fetch(operation, { ...cacheConfig, force: true });
        },
      };
      if (this._selectionReference) {
        // TODO: GC better
        // this._selectionReference.dispose();
      }
      this._pendingFetch = null;
      if (onComplete) {
        onComplete();
      }
      this._selectionReference = nextReference;
      this._setState({ readyState });
    };
    const onNext = () => {
      // `onNext` can be called multiple times by network layers that support
      // data subscriptions. Wait until the first payload to render `props` and
      // subscribe for data updates.
      if (snapshot) {
        return;
      }
      snapshot = environment.lookup(operation.fragment);
      readyState = {
        error: null,
        props: snapshot.data,
        retry: () => {
          this._fetch(operation, { ...cacheConfig, force: true });
        },
      };

      if (this._selectionReference) {
        // TODO: GC better
        // this._selectionReference.dispose();
      }
      this._rootSubscription = environment.subscribe(snapshot, this._onChange);
      this._selectionReference = nextReference;

      if (isFunctionReturned) {
        this._setState({ readyState });
      }
    };

    if (this._pendingFetch) {
      this._pendingFetch.dispose();
    }
    if (this._rootSubscription) {
      this._rootSubscription.dispose();
    }
    const request = environment.streamQuery({
      cacheConfig,
      onCompleted,
      onError,
      onNext,
      operation,
    });
    this._pendingFetch = {
      dispose() {
        request.dispose();
        // TODO: GC better
        // nextReference.dispose();
      },
    };

    isFunctionReturned = true;
    return readyState;
  }

  _onChange = (snapshot: Snapshot): void => {
    this._setState({
      readyState: {
        ...this.state.readyState,
        props: snapshot.data,
      },
    });
  }

  _setState(state: Object): void {
    if (this._mounted) {
      this.setState((prevState) => {
        let lastProps = prevState.lastProps;
        if (state.props == null && prevState.readyState.props != null) {
          lastProps = prevState.readyState.props;
        } else if (lastProps == null && state.props != null) {
          lastProps = state.props;
        }
        return {
          ...state,
          lastProps,
        };
      });
    } else {
      this._latestState = state;
    }
  }

  getChildContext(): Object {
    return {
      relay: this._relayContext,
    };
  }

  render() {
    return this.props.render(
      this.state.readyState,
      this.state.lastProps,
    );
  }
}
ReactRelayQueryRenderer.childContextTypes = {
  relay: () => null,
};

type Config = {|
  mapPropsToVariables?: {
    client: (props: Object, prevProps?: Object) => ?Object,
    server?: (props: Object) => ?Object,
  },
  asyncContinue?: boolean,
  withPrevProps?: boolean,
  skipNullVariables?: boolean,
  cacheConfig?: ?CacheConfig,
|};
export default function<LoggingContext>(
  log: Log<*, *, *, LoggingContext>,
) {
  return (
    query: GraphQLTaggedNode,
    configIn?: Config,
  ) => {
    const config = ((configIn || {
      asyncContinue: false,
      withPrevProps: false,
      skipNullVariables: false,
    }): Config);
    const mapPropsToVariables =
      config.mapPropsToVariables == null
        // eslint-disable-next-line
        ? (props, prevProps) => ({})
        : config.mapPropsToVariables.client;
    const mapServerPropsToVariables =
      config.mapPropsToVariables == null || config.mapPropsToVariables.server == null
        // eslint-disable-next-line
        ? (props, prevProps) => ({})
        : config.mapPropsToVariables.server;
    const asyncContinue = !!config.asyncContinue;
    const withPrevProps = !!config.withPrevProps;
    const skipNullVariables = !!config.skipNullVariables;
    return (WrappedComponent: Class<React.Component<any, any, any>>) => {
      let component;
      if (withPrevProps) {
        // eslint-disable-next-line
        component = class Component extends React.Component {
          _prevProps: Object;

          render(): React.Element<*> {
            const prevProps = this._prevProps;
            this._prevProps = this.props;
            return (
              <ReactRelayQueryRenderer
                environment={this.props.relayEnvironment}
                query={query}
                variables={mapPropsToVariables(this.props, prevProps)}
                render={(readyState, lastProps) => (
                  <WrappedComponent
                    {...this.props}
                    {...readyState}
                    lastProps={lastProps}
                  />
                )}
                asyncContinue={asyncContinue}
                loggingContext={this.props.loggingContext}
                skipNullVariables={skipNullVariables}
                cacheConfig={config.cacheConfig}
                log={log}
              />
            );
          }
        };
      } else {
        component = (props: Object) => (
          <ReactRelayQueryRenderer
            environment={props.relayEnvironment}
            query={query}
            variables={mapPropsToVariables(props)}
            render={(readyState, lastProps) => (
              <WrappedComponent
                {...props}
                {...readyState}
                lastProps={lastProps}
              />
            )}
            asyncContinue={asyncContinue}
            loggingContext={props.loggingContext}
            skipNullVariables={skipNullVariables}
            cacheConfig={config.cacheConfig}
            log={log}
          />
        );
      }
      component.displayName =
        `QueryRenderer(${getDisplayName(WrappedComponent)})`;
      const ComponentWithContext = getContext({
        relayEnvironment: () => null,
        loggingContext: () => null,
      })(component);

      ComponentWithContext.asyncBootstrap = async (
        match: Object,
        environment: Environment,
      ) => {
        if (
          process.env.BUILD_FLAG_IS_SERVER && 
          config.mapPropsToVariables != null && (
            config.mapPropsToVariables.client == null ||
            config.mapPropsToVariables.server != null
          )
        ) {
          let serverQuery = query;
          const serverVariables = mapServerPropsToVariables({ match });
          if (
            serverQuery && (
              !skipNullVariables ||
              serverVariables != null
            )
          ) {
            const {
              createOperationSelector,
              getOperation,
            } = environment.unstable_internal;
            serverQuery = getOperation(serverQuery);
            const operation = createOperationSelector(
              serverQuery,
              serverVariables || {},
            );
            await new Promise((resolve, reject) => environment.streamQuery({
              cacheConfig: undefined,
              onCompleted: () => {
                resolve();
              },
              onError: reject,
              operation,
            }));
          }
        }
      }
      return ComponentWithContext;
    };
  };
}
