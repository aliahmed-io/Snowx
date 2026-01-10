import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const f = createUploadthing();

const auth = async () => {
    try {
        const { getUser, getPermissions } = getKindeServerSession();
        const user = await getUser();
        const permissions = await getPermissions();

        console.log("UploadThing Auth:", {
            userId: user?.id,
            permissions: permissions?.permissions
        });

        if (!user) throw new Error("Unauthorized: User not found");
        // if (!permissions?.permissions?.includes("admin:access")) throw new Error("Unauthorized: Missing admin permission");

        return { userId: user.id };
    } catch (error) {
        console.error("UploadThing Auth Error:", error);
        throw error;
    }
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            // This code runs on your server before upload
            const user = await auth();
            // If you throw, the user will not be able to upload
            // return { userId: user.userId };
            return { userId: user.userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
