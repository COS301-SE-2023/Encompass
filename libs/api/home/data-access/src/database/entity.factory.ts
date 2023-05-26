export interface EntityFactory<TEntity> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(...args: any): TEntity | Promise<TEntity>;
}