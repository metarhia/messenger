import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let middleware = [thunk];

  // eslint-disable-next-line
  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
  }

  console.log(...rootReducer);

  return createStore(
    combineReducers({
      ...rootReducer,
      routing: routerReducer
    }),
    initialState,
    applyMiddleware(...middleware)
  );
}
