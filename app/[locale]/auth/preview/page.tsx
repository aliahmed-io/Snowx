import { AuthForm } from "@/components/auth/AuthForm";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

export default function AuthPreviewPage() {
    return (
        <AuthSplitLayout>
            <AuthForm />
        </AuthSplitLayout>
    );
}
