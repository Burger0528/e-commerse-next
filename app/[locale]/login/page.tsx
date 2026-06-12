import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import AuthForm from "@/components/AuthForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  if (session.userId) redirect(`/${locale}`);

  return <AuthForm mode="login" action={loginAction} />;
}
