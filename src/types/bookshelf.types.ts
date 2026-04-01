export type BookshelfItem = {
  id: number;
  title: string | null;
  url: string | null;
  created_at: string;
  folder: number;
};

export type BookshelfFolder = {
  id: number;
  name: string;
  parent: number | null;
  subfolders: BookshelfFolder[];
  items: BookshelfItem[];
};

export enum BookshelfModalType {
  NONE = "NONE",
  CREATE_FOLDER = "CREATE_FOLDER",
  ADD_LINK = "ADD_LINK",
}

export type CreateFolderPayload = {
  name: string;
  parent: number | null;
};

export type CreateFolderItemPayload = {
  folder: number;
  title?: string;
  url?: string;
};
