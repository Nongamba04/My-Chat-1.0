import { Icon, Icons } from "@/components/icons";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

interface SidebarOption {
  id: number,
  name: string,
  href: string,
  Icon: Icon
}

const sidebarOptions: SidebarOption[]=[
  {
    id: 1,
    name: 'Add a friend',
    href: '/dashboard/add',
    Icon: 'UserPlus'
  }
]
const layout = async ({ children }: layoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  return (
    <div className="w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5  overflow-y-auto border-r border-gray-200 bg-white p-5 ">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center ">
          <Icons.Logo className="h-8 w-auto text-indigo-500" />
        </Link>

        <div className="text-lg font-semibold leading-6 text-gray-400 ">
          Your Chats
        </div>

        <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>//chats of the user</li>
                <li>
                    <div className="text-lg text-semibold leading-6 text-gray-400">Overview</div>
                </li>

                <ul role="list" className='mx-2 mt-2 space-y-1'>
                  {sidebarOptions.map((option,id)=>{
                    const Icon = Icons[option.Icon]
                    return (
                      <li key = {option.id}>
                        <Link href={option.href} className="text-gray-600 hover:text-indigo-600 hover:bg-blue-600 group flex gap-3 rounded-md p-2 leading-6 font-semibold">
                          <span className="text-gray-700 border-gray-600 group-hover:border-indigo-600 group-hover:text-indigo-500 flex w-6 shrink-0 items-center justify-center rounded-lg border text-[0.635rem] font-medium bg-white">
                            <Icon className="h-4 w-4"/>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
            </ul>
        </nav>
      </div>

      {children}
    </div>
  );
};

export default layout;
