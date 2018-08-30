# Redux Modules

[![CircleCI](https://circleci.com/gh/kjrocker/redux-modules.svg?style=svg)](https://circleci.com/gh/kjrocker/redux-modules)

It's a common redux practice to arrange your reducers, actions, and (if you use them) selectors together based on their domain. But what if you want each domain export its own middleware, or its own `initialState`. Wouldn't it be nice if every part of your apps domain just told you what it needed, and you didn't have to worry about adding 15 lines of store configuration or initialization scripts just to use a specific part of your app?

Well look no further, because this is what `redux-modules` aims to solve.

## Example

First you create your module:

```
import authReducer from './reducer'
// Something to fetch user tokens from localStorage if needed?
import authMiddleware from './middleware'

const authModule = {
  name: 'Auth',
  reducers: { auth: authReducer },
  middleware: [authMiddleware],
}
```

Then you create your store:

```
const store = createModuleStore()([authModule])
```

And thats it! Your authorization logic can now count on the middleware being there as long as the reducers are there, and the module consumer didn't need to know about any of it.

## Another Example

Of course, there are _some_ options for application wide logic. That's what the first option in createModuleStore is for.
Let's look at the simplest possible example:

```
import thunk from 'redux-thunk'
import createModuleStore from 'redux-modules'

export const createThunkStore = createModuleStore({middleware: [thunk]})
```

Then you just apply your modules:

```
import { createThunkStore } from './createThunkStore'
import { authModule } from './auth'

const store = createThunkStore([authModule])
```
