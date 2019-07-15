type ActionCollection<S, A> = {
  [type in keyof A]: (state: S, e: A[type]) => S;
};

export default class TypeRegi<S, A> {
  private state: S;

  private actionCollection: ActionCollection<S, A>;

  private subscriptions: ((state: S) => void)[] = [];

  private timer: number = 0;

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

    this.fireTimer(() => {
      this.subscriptions.forEach(handler => handler(this.state));
    });
  }

  public getState() {
    return this.state;
  }

  public subscribe(handler: (state: S) => void): () => void {
    this.subscriptions.push(handler);

    // すでにsubscriptions実行のtimerがいるときはそれに任せる
    if (!this.timer) {
      this.fireTimer(() => {
        handler(this.state);
      });
    }

    return () => {
      const index = this.subscriptions.findIndex(h => h === handler);
      this.subscriptions = [
        ...this.subscriptions.slice(0, index),
        ...this.subscriptions.slice(index + 1)
      ];
    };
  }

  private fireTimer(fn: () => void) {
    if (this.timer) {
      this.clearTimer();
    }
    this.timer = setTimeout(() => {
      fn();
      this.clearTimer();
    });
  }

  private clearTimer() {
    clearTimeout(this.timer);
    this.timer = 0;
  }
}
