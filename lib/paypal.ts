import { core, orders } from "@paypal/checkout-server-sdk";

// PayPal environment configuration
function environment() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.");
    }

    if (process.env.PAYPAL_MODE === "live") {
        return new core.LiveEnvironment(clientId, clientSecret);
    }
    return new core.SandboxEnvironment(clientId, clientSecret);
}

let paypalClient: core.PayPalHttpClient | null = null;

export function getPayPalClient(): core.PayPalHttpClient {
    if (!paypalClient) {
        paypalClient = new core.PayPalHttpClient(environment());
    }
    return paypalClient;
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CreateOrderParams {
    items: CartItem[];
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
}

interface PayPalOrderResponse {
    id: string;
    status: string;
    links?: Array<{ rel: string; href: string }>;
}

interface PayPalCaptureResponse {
    id: string;
    status: string;
    payer?: {
        email_address?: string;
        name?: {
            given_name?: string;
            surname?: string;
        };
    };
    purchase_units?: Array<{
        custom_id?: string;
        amount?: {
            value?: string;
            breakdown?: {
                item_total?: { value?: string };
                tax_total?: { value?: string };
                shipping?: { value?: string };
            };
        };
    }>;
}

export async function createPayPalOrder({
    items,
    successUrl,
    cancelUrl,
    metadata,
}: CreateOrderParams) {
    const client = getPayPalClient();

    // Calculate totals
    const itemsTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = itemsTotal * 0.1; // 10% tax
    const shipping = itemsTotal < 50 ? 5.99 : 0;
    const total = itemsTotal + tax + shipping;

    const request = new orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: total.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: "USD",
                            value: itemsTotal.toFixed(2),
                        },
                        tax_total: {
                            currency_code: "USD",
                            value: tax.toFixed(2),
                        },
                        shipping: {
                            currency_code: "USD",
                            value: shipping.toFixed(2),
                        },
                    },
                },
                items: items.map((item) => ({
                    name: item.name,
                    unit_amount: {
                        currency_code: "USD",
                        value: item.price.toFixed(2),
                    },
                    quantity: item.quantity.toString(),
                    category: "DIGITAL_GOODS",
                })),
                custom_id: metadata ? JSON.stringify(metadata) : undefined,
            },
        ],
        application_context: {
            return_url: successUrl,
            cancel_url: cancelUrl,
            brand_name: "SnowX",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
        },
    });

    const response = await client.execute<PayPalOrderResponse>(request);
    const order = response.result;

    // Find approval URL
    const approvalLink = order.links?.find(
        (link) => link.rel === "approve"
    );

    return {
        orderId: order.id,
        approvalUrl: approvalLink?.href,
        status: order.status,
    };
}

export async function capturePayPalPayment(orderId: string) {
    const client = getPayPalClient();

    const request = new orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await client.execute<PayPalCaptureResponse>(request);
    const capture = response.result;

    return {
        id: capture.id,
        status: capture.status,
        payer: capture.payer,
        purchaseUnits: capture.purchase_units,
    };
}

export async function getPayPalOrderDetails(orderId: string) {
    const client = getPayPalClient();

    const request = new orders.OrdersGetRequest(orderId);
    const response = await client.execute<PayPalCaptureResponse>(request);

    return response.result;
}
