import { useEffect, useState } from "react";
import { ClientDataStoreAgent } from "~/common/ClientDataStoreAgent";
import type ProfilePost from "@hinagata-next/core/feature/ProfilePost";
import type DummyProfile from "@hinagata-next/core/feature/DummyProfile";
import { profileDataStoreSchema } from "@hinagata-next/core/feature/app-data-store-schema";

const profileDataStore = new ClientDataStoreAgent(profileDataStoreSchema);

export const updateProfilePost = (charaId: string, profile: DummyProfile) =>
  profileDataStore.mergeItem({ charaId, data: { profile } });

export const deleteProfilePost = (charaId: string) =>
  profileDataStore.deleteItem({ charaId });

export const useProfileList = () => {
  const [list, setList] = useState<{ id: string; data: ProfilePost }[] | null>(
    null
  );
  const [error, setError] = useState<unknown>(null);

  useEffect(
    () =>
      profileDataStore.subscribeList({
        query: [["orderBy", "createdAt", "desc"]],
        handler: setList,
        onError: setError
      }),
    []
  );

  return { list, error };
};
