import { useCallback, useMemo, useState } from "react";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import DummyProfileForm from "~/component/DummyProfileForm";
import DummyProfileListView from "~/component/DummyProfileListView";
import MockActionButton from "~/component/MockActionButton";
import MockStaticLayout from "~/component/MockStaticLayout";

const EMPTY_PROFILE: DummyProfile = {
  name: "",
  email: "",
  profileLinks: []
};

const TopScene = () => {
  const [list, setList] = useState<{ id: number; data: DummyProfile }[]>([]);
  const [formTarget, setFormTarget] = useState<{
    postId: number | null;
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
    (v: DummyProfile) => {
      setList(l => [{ id: Date.now(), data: v }, ...l]);
      closeForm();
    },
    [closeForm]
  );

  const handleUpdate = useCallback(
    (postId: number) => (profile: DummyProfile) => {
      setList(l =>
        l.map(d => (d.id === postId ? { id: d.id, data: profile } : d))
      );
      closeForm();
    },
    [closeForm]
  );

  const handleDelete = useCallback(
    (postId: number) => setList(l => l.filter(d => d.id !== postId)),
    []
  );

  return (
    <MockStaticLayout title="Welcome to Next.js!">
      {formTarget && currentFormData ? (
        <DummyProfileForm
          defaultValue={currentFormData}
          onSubmit={
            formTarget.postId ? handleUpdate(formTarget.postId) : handleCreate
          }
          onCancel={closeForm}
        />
      ) : (
        <>
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

export default TopScene;
