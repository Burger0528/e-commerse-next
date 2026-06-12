import { getSession } from "@/lib/session";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getSession();
  const user = session.userId
    ? { name: session.name, email: session.email }
    : null;

  return <NavbarClient user={user} />;
}
