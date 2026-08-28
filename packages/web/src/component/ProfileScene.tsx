import { useMemo, useState } from "react";
import callAppCallable from "~/common/callAppCallable";
import {
  signInWithGoogle,
  useAuthorizedUser
} from "~/common/firebase-auth-tools";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import { extractAppError } from "@hinagata-next/core/feature/AppError";
import {
  deleteProfilePost,
  updateProfilePost,
  useProfileList
} from "~/component/_provider/profileDataStoreProvider";
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
  const [formTarget, setFormTarget] = useState<"new" | string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentFormData = useMemo((): DummyProfile | null => {
    if (formTarget === null) {
      return null;
    }
    if (formTarget === "new") {
      return EMPTY_PROFILE;
    }
    const m = list?.find(d => d.id === formTarget);
    return m ? m.data.profile : null;
  }, [list, formTarget]);

  const closeForm = () => setFormTarget(null);
  const showError = (e: unknown) => setSubmitError(extractAppError(e).message);

  const handleCreate = (profile: DummyProfile) => {
    setSubmitError(null);
    callAppCallable("createProfilePost", { profile })
      .then(closeForm)
      .catch(showError);
  };

  const handleUpdate = (postId: string) => (profile: DummyProfile) => {
    setSubmitError(null);
    updateProfilePost(postId, profile).then(closeForm).catch(showError);
  };

  const handleDelete = (postId: string) => {
    setSubmitError(null);
    deleteProfilePost(postId).catch(showError);
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
      ) : formTarget !== null && currentFormData ? (
        <DummyProfileForm
          defaultValue={currentFormData}
          onSubmit={
            formTarget === "new" ? handleCreate : handleUpdate(formTarget)
          }
          onCancel={closeForm}
        />
      ) : (
        <>
          {submitError ? <p>{submitError}</p> : null}
          <p>
            <MockActionButton
              action={{ type: "button", onClick: () => setFormTarget("new") }}
            >
              新規作成
            </MockActionButton>
          </p>
          <DummyProfileListView
            list={(list ?? []).map(({ id, data }) => ({
              id,
              data: data.profile,
              editable: data.userId === myId
            }))}
            onEdit={id => setFormTarget(id)}
            onDelete={handleDelete}
          />
        </>
      )}
    </MockStaticLayout>
  );
};

export default ProfileScene;
