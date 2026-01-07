import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

interface KindeUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    picture?: string;
}

interface KindeEvent {
    type: string;
    data: {
        user: KindeUser;
    };
}

export async function POST(req: Request) {
    try {
        // In a real production app, you should verify the signature from Kinde
        // const token = await req.text();
        // const jwt = jwt_decode(token);

        const event = await req.json() as KindeEvent;

        if (event.type === "user.created") {
            const { user } = event.data;
            const isAdmin = user.email === process.env.ADMIN_EMAIL;

            // 1. Create Stripe Customer
            const stripe = getStripe();
            const stripeCustomer = await stripe.customers.create({
                email: user.email,
                name: `${user.first_name} ${user.last_name}`,
                metadata: {
                    kindeId: user.id
                }
            });

            // 2. Create User in DB
            await db.user.create({
                data: {
                    kindeId: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    profileImage: user.picture,
                    role: isAdmin ? "ADMIN" : "CUSTOMER",
                    stripeCustomerId: stripeCustomer.id
                }
            });

            console.log(`User created: ${user.email} (Admin: ${isAdmin})`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Kinde webhook error:", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
