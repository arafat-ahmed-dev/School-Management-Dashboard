import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import Image from "next/image";

const UserInfo = async () => {
    const session = await getServerSession(authOptions);

    return (
        <>
            <div className="flex flex-col">
                <span className="text-xs font-medium leading-3">
                    {session?.user?.name || "User"}
                </span>
                <span className="text-right text-[10px] text-gray-500">
                    {session?.user?.role || "Role"}
                </span>
            </div>
            <Image
                src="/avatar.png"
                alt="user"
                width={36}
                height={36}
                className="rounded-full"
            />
        </>
    );
};

export default UserInfo;