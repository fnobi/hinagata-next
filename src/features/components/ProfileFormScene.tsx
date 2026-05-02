"use client";

import { useCallback, useMemo, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import MockActionButton from "~/common/components/MockActionButton";
import MockStaticLayout from "~/common/components/MockStaticLayout";
import { useDataStoreList } from "~/common/lib/database-common-hooks";
import { ClientDataStoreAgent } from "~/common/lib/ClientDataStoreAgent";
import { useAuthorizedUser } from "~/common/lib/firebase-auth-tools";
import { firebaseAuth } from "~/common/lib/firebase-app";
import { profileDataStoreScheme } from "~/features/schema/app-data-store-scheme";
import type DummyProfile from "~/features/schema/DummyProfile";
import DummyProfileForm from "~/features/components/DummyProfileForm";
import DummyProfileListView from "~/features/components/DummyProfileListView";
import { parseDummyProfile } from "~/features/schema/DummyProfile";
import useAsyncHandler from "~/features/lib/useAsyncHandler";
import { type AppErrorParameter } from "~/features/schema/AppErrorParameter";
import ErrorScene from "~/features/components/ErrorScene";
import ErrorPopup from "~/features/components/ErrorPopup";
import LoadingPopup from "~/features/components/LoadingPopup";
import InlineLoading from "~/features/components/InlineLoading";

const profileDataStore = new ClientDataStoreAgent(profileDataStoreScheme);

const ProfileFormScene = () => {
  const { myId } = useAuthorizedUser();
  const [formId, setFormId] = useState("");
  const [operationError, setOperationError] =
    useState<AppErrorParameter | null>(null);
  const [statusError, setStatusError] = useState<AppErrorParameter | null>(
    null
  );

  const { isLoading, runAsyncHandler } = useAsyncHandler({
    onError: setOperationError
  });

  const params = useMemo(() => ({}), []);
  const list = useDataStoreList({
    dataStore: profileDataStore,
    params,
    onError: setStatusError
  });

  const currentFormData = useMemo((): DummyProfile | null => {
    if (!formId || !list) {
      return null;
    }
    const m = list.find(d => d.id === formId);
    return m ? m.data : parseDummyProfile(null);
  }, [list, formId]);

  const handleSubmit = useCallback(
    (v: DummyProfile) =>
      runAsyncHandler(() =>
        profileDataStore
          .setItem({
            userId: formId,
            data: v
          })
          .then(() => setFormId(""))
      ),
    [formId, runAsyncHandler]
  );

  const handleDelete = useCallback(
    (id: string) =>
      runAsyncHandler(() => {
        return profileDataStore.deleteItem({ userId: id });
      }),
    [runAsyncHandler]
  );

  if (statusError) {
    return <ErrorScene error={statusError} />;
  }

  return (
    <>
      <MockStaticLayout title="profiles">
        {formId && currentFormData ? (
          <DummyProfileForm
            defaultValue={currentFormData}
            onSubmit={handleSubmit}
            onCancel={() => setFormId("")}
          />
        ) : (
          <>
            {list ? (
              <>
                {myId && !list.some(d => d.id === myId) ? (
                  <p>
                    <MockActionButton
                      action={{
                        type: "button",
                        onClick: () => setFormId(myId)
                      }}
                    >
                      新規作成
                    </MockActionButton>
                  </p>
                ) : null}
                {!myId ? (
                  <p>
                    <MockActionButton
                      action={{
                        type: "button",
                        onClick: () =>
                          signInWithPopup(
                            firebaseAuth(),
                            new GoogleAuthProvider()
                          )
                      }}
                    >
                      ログイン
                    </MockActionButton>
                  </p>
                ) : null}
                <DummyProfileListView
                  list={list}
                  onEdit={id => setFormId(id)}
                  onDelete={handleDelete}
                />
              </>
            ) : (
              <InlineLoading />
            )}
          </>
        )}
      </MockStaticLayout>
      {isLoading ? <LoadingPopup /> : null}
      {operationError ? (
        <ErrorPopup
          error={operationError}
          onClose={() => setOperationError(null)}
        />
      ) : null}
    </>
  );
};

export default ProfileFormScene;
