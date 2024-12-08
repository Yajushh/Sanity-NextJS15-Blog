import { auth, signIn } from "@/auth";
import { Pen, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import ProfileIcon from "./ProfileIcon";

export default async function Navbar() {
  const session = await auth();
  if (session) {
    console.log(session);
  }
  return (
    <>
      <div className="flex bg-white shadow-md px-10 py-2 mx-auto h-20">
        <div className="flex justify-between items-center  w-full">
          <Link href={"/"} className="flex flex-row gap-3">
            <Terminal className="cursor-pointer" width={25} height={25} />
            <span className="text-bold text-xl font-bold"> Daily Terminal</span>
          </Link>
          <div className="text-black mr-10 text-md items-center flex gap-8 cursor-pointer">
            {session ? (
              <>
                <ProfileIcon />
                <span>ID : {session?.user?.email}</span>
                <Link href={`/create`}>
                  <Button>
                    <Pen />
                    <span>Create</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button
                  onClick={async () => {
                    "use server";
                    await signIn("github");
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
