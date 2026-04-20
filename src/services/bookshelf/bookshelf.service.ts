import { API_ROUTES } from "../../constants/api.routes";
import axiosInstance from "../../lib/axiosInstance";
import type {
  BookshelfFolder,
  CreateFolderPayload,
  CreateFolderItemPayload,
} from "../../types/bookshelf.types";

export const getFoldersTree = async (
  folderId?: number
): Promise<BookshelfFolder[]> => {
  const url = folderId
    ? `${API_ROUTES.GET_FOLDERS_TREE}?folder_id=${folderId}`
    : API_ROUTES.GET_FOLDERS_TREE;
  const response = await axiosInstance.get<BookshelfFolder[]>(url);
  return response.data;
};

export const createFolder = async (
  data: CreateFolderPayload
): Promise<BookshelfFolder> => {
  const response = await axiosInstance.post<BookshelfFolder>(
    API_ROUTES.CREATE_FOLDER,
    data
  );
  return response.data;
};

export const createFolderItem = async (
  data: CreateFolderItemPayload
): Promise<void> => {
  await axiosInstance.post(API_ROUTES.CREATE_FOLDER_ITEM, data);
};

export const updateFolder = async (
  id: number,
  data: { name: string }
): Promise<void> => {
  await axiosInstance.patch(API_ROUTES.UPDATE_FOLDER(id), data);
};

export const deleteFolder = async (id: number): Promise<void> => {
  await axiosInstance.delete(API_ROUTES.DELETE_FOLDER(id));
};

export const updateFolderItem = async (
  id: number,
  data: { title: string }
): Promise<void> => {
  await axiosInstance.patch(API_ROUTES.UPDATE_FOLDER_ITEM(id), data);
};

export const deleteFolderItem = async (id: number): Promise<void> => {
  await axiosInstance.delete(API_ROUTES.DELETE_FOLDER_ITEM(id));
};
