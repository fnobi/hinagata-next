import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import MockListView from "~/component/MockListView";

const DummyProfileListView = <Id extends string | number>({
  list,
  onEdit,
  onDelete
}: {
  list: { id: Id; data: DummyProfile; editable?: boolean }[];
  onEdit?: (id: Id) => void;
  onDelete?: (id: Id) => void;
}) => (
  <MockListView
    dataList={list.map(({ id, data, editable = true }) => ({
      key: id,
      title: data.name,
      subTitle: data.email,
      actions: [
        ...(onEdit && editable
          ? [
              {
                children: "編集",
                action: { type: "button" as const, onClick: () => onEdit(id) }
              }
            ]
          : []),
        ...(onDelete && editable
          ? [
              {
                children: "削除",
                action: {
                  type: "button" as const,
                  onClick: () => onDelete(id)
                }
              }
            ]
          : [])
      ]
    }))}
  />
);

export default DummyProfileListView;
