import { createContext, type Context } from 'react';

type ContextRegistry = typeof globalThis & {
  __fiftyStoreContexts?: Record<string, Context<unknown>>;
};

export function createStableContext<T>(key: string): Context<T | null> {
  const registryOwner = globalThis as ContextRegistry;
  registryOwner.__fiftyStoreContexts ??= {};

  const contextKey = `fifty-store:${key}`;
  const existingContext = registryOwner.__fiftyStoreContexts[contextKey] as Context<T | null> | undefined;

  if (existingContext) {
    return existingContext;
  }

  const context = createContext<T | null>(null);
  registryOwner.__fiftyStoreContexts[contextKey] = context as Context<unknown>;
  return context;
}
