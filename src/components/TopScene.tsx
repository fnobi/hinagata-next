import { useMemo, useState } from "react";
import type DummyProfile from "~/scheme/DummyProfile";
import DummyProfileForm from "~/components/DummyProfileForm";
import MockActionButton from "~/components/mock/MockActionButton";
import DummyProfileListView from "~/components/DummyProfileListView";
import MockStaticLayout from "~/components/mock/MockStaticLayout";

const TopScene = () => {
  const [list, setList] = useState<{ id: number; data: DummyProfile }[]>([]);
  const [formId, setFormId] = useState(0);

  const currentFormData = useMemo((): DummyProfile | null => {
    if (!formId) {
      return null;
    }
    const m = list.find(d => d.id === formId);
    if (m) {
      return m.data;
    }
    return { name: "", email: "", profileLinks: [] };
  }, [list, formId]);

  return (
    <MockStaticLayout title="Welcome to Next.js!">
      {formId && currentFormData ? (
        <DummyProfileForm
          defaultValue={currentFormData}
          onSubmit={v => {
            setList(l =>
              l.find(d => d.id === formId)
                ? l.map(d => (d.id === formId ? { id: d.id, data: v } : d))
                : [{ id: formId, data: v }, ...l]
            );
            setFormId(0);
          }}
          onCancel={() => setFormId(0)}
        />
      ) : (
        <>
          <p>
            <MockActionButton
              action={{
                type: "button",
                onClick: () => setFormId(Date.now())
              }}
            >
              新規作成
            </MockActionButton>
          </p>
          <DummyProfileListView
            list={list}
            onEdit={id => setFormId(id)}
            onDelete={id => setList(l => l.filter(d => d.id !== id))}
          />
        </>
      )}
    </MockStaticLayout>
  );
};

export default TopScene;
