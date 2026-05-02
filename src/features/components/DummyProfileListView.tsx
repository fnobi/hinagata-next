import MockListView from "~/common/components/MockListView";
import type DummyProfile from "~/features/schema/DummyProfile";

const DummyProfileListView = <T extends number | string>({
  list,
  onEdit,
  onDelete
}: {
  list: { id: T; data: DummyProfile }[];
  onEdit: (id: T) => void;
  onDelete: (id: T) => void;
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
