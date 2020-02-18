# vuex-wrapper

### **Wrapper around Vuex to generate store values and a computed property as an interface**

<a id="/features"></a>&nbsp;

- Creates your Vuex object
  - Support for state, getters, mutations, and actions
  - Includes plugins and modules
- Creates a mixin for object access to your Vuex store

<a id="/usage"></a>&nbsp;

## Usage

```javascript
import Vue from "vue";
import Vuex from "vuex";
import VuexWrapper from 'vuex-wrapper'

const wrapper = new VuexWrapper()
Vue.use(Vuex);

// Set a generic object
wrapper.addObject("hello", {initialValue: "world"})

// Set a custom action for an object

wrapper.addObject("foo", { 
  initialValue: "bar",
  actions: {
    updateFoo: ({ commit }, payload) => {
      // Do additional work in your action

      commit('setFoo', payload.reverse())
    }
  }
})

// Set custom computed property

wrapper.addObject("custom", {
  computed: {
    get() {
      if (this.$store.getters.getCustom !== undefined) {
        return "Nothing here yet!"
      } else {
        return this.$store.getters.getCustom
      }
    },
    set(val) {
      this.$store.dispatch("updateCustom", val)
    }
  }
})

// Set strict mode

wrapper.setStrict(true)

const vuexObject = wrapper.exportVuex()
export const vuexMixin = wrapper.exportMixin()

export default new Vuex.Store(vuex);

```

The intent of this library is to generate boilerplate Vuex values for a given key, as well as a matching computed property. This computed property uses the Vuex getter as its `get()` method, and the Vuex action for its `set(val)` method.

Using the first example above, `wrapper.addObject("hello", {initialValue: "world"})`, the following Vuex structure is generated:

```javascript

const vuex = {
  state: {
    hello: 'world'
  },
  getters: {
    getHello: state => state.hello
  },
  mutations: {
    setHello: (state, payload) => state.hello = payload
  },
  actions: {
    updateHello: ({ commit }, payload) => {
      commit('setHello', payload)
    }
  }
}

```

In addition, the following computed mixin is generated:

```javascript

const mixin = {
  computed: {
    hello: {
      get() {
        return this.$store.getters.getHello
      },
      set(val) {
        this.$store.dispatch('updateHello', val)
      }
    }
  }
}

```

### Core Methods:

```javascript

type ObjectData = {
  initialValue: string;
  computed?: { [key: string]: any };
  state?: { [key: string]: any };
  getters?: { [key: string]: any };
  actions?: { [key: string]: any };
  mutations?: { [key: string]: any };
};

addObject = (
  name: string,
  data: ObjectData
)

```

`addObject` adds a key to the Vuex store and the computed methods. By defalt, it sets the initial value to `undefined`, and the vuex state, getter, mutation, action, and computed as in the above example.

```javascript

addStatic = (data: ObjectData)

```

`addStatic` is the same as `addObject`, but without mapping to a key. This allows for custom Vuex values that do not need to be tied to a given key.

### Other Methods:

`addPlugin = (plugin: any)`

This adds a Vuex plugin to the Vuex schema. Accepts one plugin

`addModules = (modules: {[key: string]: any})`

This accepts an object with additional Vuex modules, and applies it to the Vuex schema

`setStrict = (strict: boolean)`

This toggles strict mode in Vuex. For more information, see the Vuex documentation.

`exportMixin = () => ({ computed: {...} })`

This builds a custom mixin that maps to Vuex properties.

```javascript

exportVuex = () => ({
  state: {...},
  getters: {...},
  actions: {...},
  mutations: {...},
  plugins: {...},
  modules: {...},
  strict: boolean
})

```

Exports the Vuex into a single object, to be used when generating your Vuex store.


<a id="/license"></a>&nbsp;

## License

This project is MIT Licensed.
