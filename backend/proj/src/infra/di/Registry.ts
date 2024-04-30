export class Registry {
  private dependencies: { [name: string]: any }
  static instance: Registry
  private constructor() {
    this.dependencies = {}
  }

  register(name: string, dependency: any) {
    this.dependencies[name] = dependency
  }

  inject(name: string) {
    return this.dependencies[name]
  }

  static getInstance() {
    if (!Registry.instance) {
      Registry.instance = new Registry()
    }
    return Registry.instance
  }
}

export function inject(name: string) {
  return function (target: any, propertyKey: string) {
    target[propertyKey] = new Proxy(
      {},
      {
        get(target: any, prop: string) {
          const dependency = Registry.getInstance().inject(name)
          return dependency[prop]
        },
      },
    )
  }
}
