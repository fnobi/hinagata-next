import { useCallback, useEffect, useMemo, useState } from "react";
import { type ClientDataStoreAgent } from "~/common/lib/ClientDataStoreAgent";
import {
  type QueryFormula,
  type TypedCollectionList
} from "~/common/lib/DataStoreAgent";
import type FirebaseErrorParameter from "~/common/schema/FirebaseErrorParameter";
import { extractFirebaseError } from "~/common/schema/FirebaseErrorParameter";

export const useDataStoreSingleItem = <
  T extends {},
  D extends string,
  C extends string
>({
  dataStore,
  params,
  onError
}: {
  dataStore: ClientDataStoreAgent<T, D, C>;
  params: Record<D | C, string> | null;
  onError: (e: FirebaseErrorParameter) => void;
}) => {
  const [remoteValue, setRemoteValue] = useState<T | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const normalizedValue = useMemo(
    () => dataStore.scheme.parse(remoteValue),
    [dataStore.scheme, remoteValue]
  );
  const normalizedValueIfLoaded = useMemo(
    () => (hasLoaded ? normalizedValue : null),
    [hasLoaded, normalizedValue]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemoteValue(null);
    setHasLoaded(false);
    if (!params) {
      return () => {};
    }
    return dataStore.subscribeItem({
      ...params,
      handler: v => {
        setRemoteValue(v);
        setHasLoaded(true);
      },
      onError: e => onError(extractFirebaseError(e))
    });
  }, [dataStore, onError, params]);

  return {
    hasLoaded,
    remoteValue,
    normalizedValue,
    normalizedValueIfLoaded
  };
};

export const useDataStoreList = <
  T extends {},
  D extends string,
  C extends string
>({
  dataStore,
  params,
  query,
  onError
}: {
  dataStore: ClientDataStoreAgent<T, D, C>;
  params: Record<C, string>;
  query?: QueryFormula<T>[];
  onError: (e: FirebaseErrorParameter) => void;
}) => {
  const [list, setList] = useState<TypedCollectionList<T> | null>(null);

  const handleError = useCallback(
    (e: unknown) => onError(extractFirebaseError(e)),
    [onError]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setList(null);
    return dataStore.subscribeList({
      ...params,
      query,
      handler: setList,
      onError: handleError
    });
  }, [dataStore, handleError, params, query]);

  return list;
};

export const useDataStoreGroupList = <
  T extends {},
  D extends string,
  C extends string
>({
  dataStore,
  query,
  onError
}: {
  dataStore: ClientDataStoreAgent<T, D, C>;
  query?: QueryFormula<T>[];
  onError: (e: FirebaseErrorParameter) => void;
}) => {
  const [list, setList] = useState<TypedCollectionList<T> | null>(null);

  const handleError = useCallback(
    (e: unknown) => onError(extractFirebaseError(e)),
    [onError]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setList(null);
    return dataStore.subscribeGroupList({
      query,
      handler: l =>
        setList(l.map(({ ids, data }) => ({ id: ids.join("-"), data }))),
      onError: handleError
    });
  }, [dataStore, handleError, query]);

  return list;
};
