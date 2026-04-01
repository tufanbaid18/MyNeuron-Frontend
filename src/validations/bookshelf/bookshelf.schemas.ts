import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100, "Folder name is too long"),
  parent: z.number().nullable(),
});

export type CreateFolderForm = z.infer<typeof createFolderSchema>;

export const addFileLinkSchema = z
  .object({
    folder: z.number(),
    title: z.string().optional(),
    url: z.string().optional(),
  })
  .refine(
    (data) => {
      // Must provide at least one
      return !!data.title || !!data.url;
    },
    {
      message: "You must provide either a Name or a Link.",
      path: ["title"], // Show the error on the name field
    }
  )
  .transform((data) => {
    let finalTitle = data.title?.trim() || "";
    let finalUrl = data.url?.trim() || "";

    if (finalTitle && !finalUrl) {
      // If name is provided keep link empty
      finalUrl = "";
    } else if (finalUrl && !finalTitle) {
      // If link is provided keep name same as link
      finalTitle = finalUrl;
    }
    // If both are provided, we keep them as is.

    return {
      folder: data.folder,
      title: finalTitle,
      url: finalUrl,
    };
  });

export type AddFileLinkForm = z.input<typeof addFileLinkSchema>;
