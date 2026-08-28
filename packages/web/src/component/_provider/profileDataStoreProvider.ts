import { useEffect, useState } from "react";
import { ClientDataStoreAgent } from "~/common/ClientDataStoreAgent";
import type ProfilePost from "@hinagata-next/core/feature/ProfilePost";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import { profilePostDataStoreSchema } from "@hinagata-next/core/feature/app-data-store-schema";

const profilePostDataStore = new ClientDataStoreAgent(
  profilePostDataStoreSchema
);

export const updateProfilePost = (postId: string, profile: DummyProfile) =>
  profilePostDataStore.mergeItem({ postId, data: { profile } });

export const deleteProfilePost = (postId: string) =>
  profilePostDataStore.deleteItem({ postId });

export const useProfileList = () => {
  const [list, setList] = useState<{ id: string; data: ProfilePost }[] | null>(
    null
  );
  const [error, setError] = useState<unknown>(null);

  useEffect(
    () =>
      profilePostDataStore.subscribeList({
        query: [["orderBy", "createdAt", "desc"]],
        handler: setList,
        onError: setError
      }),
    []
  );

  return { list, error };
};
