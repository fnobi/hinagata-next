import { useCallback, useMemo, useState } from "react";
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
  useProfilePostList
} from "~/component/_provider/profile-post-database";
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const showError = useCallback(
    (e: unknown) => setSubmitError(extractAppError(e).message),
    []
  );

  const { profilePostList } = useProfilePostList();

  const list = useMemo(
    () =>
      (profilePostList ?? []).map(({ id, data }) => ({
        id,
        data: data.profile,
        editable: data.userId === myId
      })),
    [profilePostList, myId]
  );

  const [formTarget, setFormTarget] = useState<{
    postId: string | null;
  } | null>(null);

  const currentFormData = useMemo((): DummyProfile | null => {
    if (!formTarget) {
      return null;
    }
    const m = list.find(d => d.id === formTarget.postId);
    return m ? m.data : EMPTY_PROFILE;
  }, [list, formTarget]);

  const closeForm = useCallback(() => setFormTarget(null), []);

  const handleCreate = useCallback(
    async (profile: DummyProfile) => {
      setSubmitError(null);
      await callAppCallable("createProfilePost", { profile })
        .then(closeForm)
        .catch(showError);
    },
    [closeForm, showError]
  );

  const handleUpdate = useCallback(
    (postId: string) => (profile: DummyProfile) => {
      setSubmitError(null);
      updateProfilePost(postId, profile).then(closeForm).catch(showError);
    },
    [closeForm, showError]
  );

  const handleDelete = useCallback(
    (postId: string) => {
      setSubmitError(null);
      deleteProfilePost(postId).catch(showError);
    },
    [showError]
  );

  return (
    <MockStaticLayout title="プロフィール一覧">
      {isAuthLoading ? (
        <p>読み込み中...</p>
      ) : !myId ? (
        <MockActionButton
          action={{
            type: "button",
            onClick: () => signInWithGoogle().catch(showError)
          }}
        >
          Googleでログイン
        </MockActionButton>
      ) : formTarget !== null && currentFormData ? (
        <DummyProfileForm
          defaultValue={currentFormData}
          onSubmit={
            formTarget.postId ? handleUpdate(formTarget.postId) : handleCreate
          }
          onCancel={closeForm}
        />
      ) : (
        <>
          {submitError ? <p>{submitError}</p> : null}
          <p>
            <MockActionButton
              action={{
                type: "button",
                onClick: () => setFormTarget({ postId: null })
              }}
            >
              新規作成
            </MockActionButton>
          </p>
          <DummyProfileListView
            list={list}
            onEdit={id => setFormTarget({ postId: id })}
            onDelete={handleDelete}
          />
        </>
      )}
    </MockStaticLayout>
  );
};

export default ProfileScene;
