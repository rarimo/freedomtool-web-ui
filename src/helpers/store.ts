import get from 'lodash/get'
import { proxy, subscribe, useSnapshot } from 'valtio'

type CreateStoreOpts<S> = {
  isPersist?: boolean
  persistProperties?: Partial<keyof S>[]
}

export const createStore = <S extends object, G extends object, A>(
  storeName: string,
  initialState: S,
  getters: (state: S) => G,
  actions: (state: S) => A,
  opts: CreateStoreOpts<S> = {
    isPersist: true,
  },
): [Readonly<S> & A & G, () => S & G] => {
  const storeOpts = {
    isPersist: true,
    ...opts,
  }

  const storageState = localStorage.getItem(storeName)

  let parsedStorageState: S = {} as S

  try {
    parsedStorageState = JSON.parse(storageState!)
  } catch {
    /* empty */
  }

  const preparedState = { ...initialState, ...parsedStorageState }

  const store = proxy<{
    state: S
    getters: G
  }>({
    state: preparedState,
    getters: getters(preparedState),
  })

  const storeActions = actions(store.state)

  subscribe(store.state, () => {
    store.getters = getters(store.state)
  })

  if (storeOpts?.persistProperties?.length) {
    subscribe(store.state, () => {
      localStorage.setItem(
        storeName,
        JSON.stringify(
          storeOpts.persistProperties!.reduce((acc, key) => {
            acc[key] = get(store.state, key)

            return acc
          }, {} as Partial<S>),
        ),
      )
    })
  } else if (storeOpts?.isPersist) {
    subscribe(store.state, () => {
      localStorage.setItem(storeName, JSON.stringify(store.state))
    })
  }

  return [
    Object.assign(store.state, store.getters, storeActions),
    (): S & G => {
      const stateSnapshot = useSnapshot(store.state)
      const gettersSnapshot = useSnapshot(store.getters)

      return Object.assign({}, stateSnapshot, gettersSnapshot) as S & G
    },
  ]
}
