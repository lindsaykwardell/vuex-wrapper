const capFirstLetter = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);

type ObjectData = {
  initialValue: string;
  computed: { [key: string]: any };
  state: { [key: string]: any };
  getters: { [key: string]: any };
  actions: { [key: string]: any };
  mutations: { [key: string]: any };
};

class Store {
  private state = {};
  private getters = {};
  private actions = {};
  private mutations = {};
  private computed = {};

  private defaultState = (name: string, initialValue: string) => ({
    [name]: initialValue
  });
  private defaultGetter = (name: string) => ({
    [`get${capFirstLetter(name)}`]: (state: any) => state[name]
  });
  private defaultAction = (name: string) => ({
    [`update${capFirstLetter(name)}`]: (
      { commit }: { commit: any },
      payload: any
    ) => commit(`set${capFirstLetter(name)}`, payload)
  });
  private defaultMutation = (name: string) => ({
    [`set${capFirstLetter(name)}`]: (state: any, payload: any) =>
      (state[name] = payload)
  });
  private defaultComputed = (name: string) => ({
    get() {
      return this.$store.getters[`get${capFirstLetter(name)}`];
    },
    set(val: any) {
      this.$store.dispatch(`update${capFirstLetter(name)}`, val);
    }
  });

  public addObject = (
    name: string,
    data: ObjectData = {
      initialValue: undefined,
      computed: undefined,
      state: undefined,
      getters: undefined,
      actions: undefined,
      mutations: undefined
    }
  ) => {
    this.state = {
      ...this.state,
      ...(data.state
        ? data.state
        : this.defaultState(
            name,
            data.initialValue ? data.initialValue : undefined
          ))
    };
    this.getters = {
      ...this.getters,
      ...(data.getters ? data.getters : this.defaultGetter(name))
    };
    this.actions = {
      ...this.actions,
      ...(data.actions ? data.actions : this.defaultAction(name))
    };
    this.mutations = {
      ...this.mutations,
      ...(data.mutations ? data.mutations : this.defaultMutation(name))
    };
    this.computed = {
      ...this.computed,
      [name]: data.computed ? data.computed : this.defaultComputed(name)
    };
  };

  public exportMixin = () => ({
    computed: this.computed
  });

  public exportVuex = () => {
    return {
      state: this.state,
      getters: this.getters,
      actions: this.actions,
      mutations: this.mutations
    };
  };
}

export = Store;
