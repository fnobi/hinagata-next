type ActionCollection<S, A> = {
  [type in keyof A]: (state: S, e: A[type]) => S;
};

export default class SRedux<S, A> {
  private state: S;

  private actionCollection: ActionCollection<S, A>;

  private subscriptions: ((state: S) => void)[] = [];

  public constructor(state: S, actionCollection: ActionCollection<S, A>) {
    this.state = state;
    this.actionCollection = actionCollection;
  }

  public dispatch<K extends keyof A>(type: K, payload: A[K]): void {
    const reducer = this.actionCollection[type];
    if (!reducer) {
      return;
    }
    const newState = reducer(this.state, payload);
    this.state = newState;

    // TODO: timerは賢く実行(同期的に複数回呼ばれてもこいつは一度しか掛けない)
    setTimeout(() => {
      this.subscriptions.forEach(handler => handler(this.state));
    });
  }

  public getState() {
    return this.state;
  }

  public subscribe(handler: (state: S) => void): () => void {
    this.subscriptions.push(handler);
    setTimeout(() => {
      handler(this.state);
    });
    return () => {
      const index = this.subscriptions.findIndex(h => h === handler);
      this.subscriptions = [
        ...this.subscriptions.slice(0, index),
        ...this.subscriptions.slice(index + 1)
      ];
    };
  }
}
