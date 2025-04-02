import type DummyProfile from "~/scheme/DummyProfile";
import MockListView from "~/components/mock/MockListView";

function DummyProfileListView({
  list,
  onEdit,
  onDelete
}: {
  list: { id: number; data: DummyProfile }[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <MockListView
      dataList={list.map(({ id, data }) => ({
        key: id,
        title: data.name,
        subTitle: data.email,
        actions: [
          {
            children: "編集",
            action: { type: "button", onClick: () => onEdit(id) }
          },
          {
            children: "削除",
            action: {
              type: "button",
              onClick: () => onDelete(id)
            }
          }
        ]
      }))}
    />
  );
}

export default DummyProfileListView;
