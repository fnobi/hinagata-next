import { useState } from "react";
import callAppCallable from "~/common/callAppCallable";
import {
  signInWithGoogle,
  useAuthorizedUser
} from "~/common/firebase-auth-tools";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import { extractAppError } from "@hinagata-next/core/feature/AppError";
import { useProfileList } from "~/component/_provider/profileDataStoreProvider";
import DummyProfileForm from "~/component/DummyProfileForm";
import DummyProfileListView from "~/component/DummyProfileListView";
import MockActionButton from "~/component/MockActionButton";
import MockStaticLayout from "~/component/MockStaticLayout";

const EMPTY_PROFILE: DummyProfile = {
  name: "",
  email: "",
  profileLinks: []
};

const ProfileScene = () => {
  const { isAuthLoading, myId } = useAuthorizedUser();
  const { list } = useProfileList();
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (profile: DummyProfile) => {
    setSubmitError(null);
    callAppCallable("createProfile", { profile })
      .then(() => setShowForm(false))
      .catch(e => setSubmitError(extractAppError(e).message));
  };

  return (
    <MockStaticLayout title="プロフィール一覧">
      {isAuthLoading ? (
        <p>読み込み中...</p>
      ) : !myId ? (
        <MockActionButton
          action={{
            type: "button",
            onClick: () => {
              signInWithGoogle().catch(() => {});
            }
          }}
        >
          Googleでログイン
        </MockActionButton>
      ) : showForm ? (
        <DummyProfileForm
          defaultValue={EMPTY_PROFILE}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          {submitError ? <p>{submitError}</p> : null}
          <p>
            <MockActionButton
              action={{ type: "button", onClick: () => setShowForm(true) }}
            >
              新規作成
            </MockActionButton>
          </p>
          <DummyProfileListView
            list={(list ?? []).map(({ id, data }) => ({
              id,
              data: data.profile
            }))}
          />
        </>
      )}
    </MockStaticLayout>
  );
};

export default ProfileScene;
