"use client";

import { useCallback, useMemo, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import MockActionButton from "~/component/MockActionButton";
import MockStaticLayout from "~/component/MockStaticLayout";
import { useDataStoreList } from "~/common/database-common-hooks";
import { ClientDataStoreAgent } from "~/common/ClientDataStoreAgent";
import { useAuthorizedUser } from "~/common/firebase-auth-tools";
import { firebaseAuth } from "~/common/firebase-app";
import { profileDataStoreScheme } from "~/feature/app-data-store-scheme";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import DummyProfileForm from "~/component/DummyProfileForm";
import DummyProfileListView from "~/component/DummyProfileListView";
import { parseDummyProfile } from "@hinagata-next/core/feature/DummyProfile";
import useAsyncHandler from "~/feature/useAsyncHandler";
import { type AppErrorParameter } from "~/feature/AppErrorParameter";
import ErrorScene from "~/component/ErrorScene";
import ErrorPopup from "~/component/ErrorPopup";
import LoadingPopup from "~/component/LoadingPopup";
import InlineLoading from "~/component/InlineLoading";

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
