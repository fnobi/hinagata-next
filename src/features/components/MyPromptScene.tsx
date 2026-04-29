"use client";

import { useCallback, useMemo } from "react";
import { ClientDataStoreAgent } from "~/common/lib/ClientDataStoreAgent";
import { useDataStoreList } from "~/common/lib/database-common-hooks";
import { useAuthorizedUser } from "~/common/lib/firebase-auth-tools";
import type FirebaseErrorParameter from "~/common/schema/FirebaseErrorParameter";
import { myPromptDataStoreScheme } from "~/features/schema/app-data-store-scheme";

const myPromptDataStore = new ClientDataStoreAgent(myPromptDataStoreScheme);

const ListView = ({ userId: userId }: { userId: string }) => {
  const params = useMemo(() => ({ userId }), [userId]);
  const handleError = useCallback(
    (e: FirebaseErrorParameter) => console.error(e),
    []
  );
  const list = useDataStoreList({
    dataStore: myPromptDataStore,
    params,
    onError: handleError
  });

  if (!list) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <p>{list.length}件</p>
      <div>
        {list.map(({ id, data }) => (
          <p key={id}>{JSON.stringify(data.subjectItems)}</p>
        ))}
      </div>
    </div>
  );
};

const MyPromptScene = () => {
  const { myId } = useAuthorizedUser();
  if (!myId) {
    return <div>この機能を使うにはログインしてください。</div>;
  }
  return <ListView userId={myId}></ListView>;
};

export default MyPromptScene;
