import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";

export async function getUser() {
    const { getUser: getKindeUser, isAuthenticated } = getKindeServerSession();

    if (!(await isAuthenticated())) {
        return null;
    }

    const kindeUser = await getKindeUser();

    if (!kindeUser || !kindeUser.id) {
        return null;
    }

    // Find or create user in database
    let user = await db.user.findUnique({
        where: { kindeId: kindeUser.id },
    });

    if (!user) {
        user = await db.user.create({
            data: {
                kindeId: kindeUser.id,
                email: kindeUser.email || "",
                firstName: kindeUser.given_name,
                lastName: kindeUser.family_name,
                profileImage: kindeUser.picture,
                role: (process.env.ADMIN_EMAILS?.split(",") || []).map(e => e.trim()).includes(kindeUser.email || "") ? "ADMIN" : "CUSTOMER",
            },
        });
    }

    return user;
}

export async function requireAuth() {
    const user = await getUser();

    if (!user) {
        redirect("/api/auth/login");
    }

    return user;
}

export async function requireAdmin() {
    const user = await requireAuth();

    if (user.role !== "ADMIN") {
        redirect("/");
    }

    return user;
}

export async function getCurrentUser() {
    const { getUser: getKindeUser, isAuthenticated } = getKindeServerSession();

    if (!(await isAuthenticated())) {
        return null;
    }

    return await getKindeUser();
}
