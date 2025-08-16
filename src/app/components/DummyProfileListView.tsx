import MockListView from "~/common/components/MockListView";
import type DummyProfile from "~/app/scheme/DummyProfile";

const DummyProfileListView = ({
  list,
  onEdit,
  onDelete
}: {
  list: { id: number; data: DummyProfile }[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => (
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

export default DummyProfileListView;
