import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let middleware;
  // eslint-disable-next-line
  if (process.env.NODE_ENV === 'development') {
    let logger = createLogger();
    middleware = applyMiddleware(thunk, logger);
  } else {
    middleware = applyMiddleware(thunk);
  }

  return createStore(rootReducer, initialState, middleware);
}
