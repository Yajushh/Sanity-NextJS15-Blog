import { auth, signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
//className="rounded-full text-bold text-lg text-black size-10 border-black  bg-slate-200 shadow-md "
export default async function ProfileIcon() {
  const session = await auth();
  const name = session?.user?.name;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full shadow-sm "
          />
        )}

        {!session?.user?.image && (
          <User className="rounded-full shadow-sm " width={40} height={40} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Posts</DropdownMenuItem>
        <DropdownMenuItem>Saved</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          <span
            onClick={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            Log out
          </span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
