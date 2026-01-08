declare module "@paypal/checkout-server-sdk" {
    namespace core {
        class PayPalHttpClient {
            constructor(environment: SandboxEnvironment | LiveEnvironment);
            execute<T>(request: unknown): Promise<{ result: T; statusCode: number }>;
        }

        class SandboxEnvironment {
            constructor(clientId: string, clientSecret: string);
        }

        class LiveEnvironment {
            constructor(clientId: string, clientSecret: string);
        }
    }

    namespace orders {
        class OrdersCreateRequest {
            prefer(preference: string): void;
            requestBody(body: unknown): void;
        }

        class OrdersCaptureRequest {
            constructor(orderId: string);
            requestBody(body: unknown): void;
        }

        class OrdersGetRequest {
            constructor(orderId: string);
        }
    }

    export { core, orders };
}
