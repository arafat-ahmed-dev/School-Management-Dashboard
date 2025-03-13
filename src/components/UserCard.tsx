import prisma from "../../prisma";

const UserCard = async({ type }: { type: "admin" | "teacher" | "parent" | "student" }) => {
  const roleModel : Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    parent: prisma.parent,
    student: prisma.student,
  };
  const data = await roleModel[type].count({
    where : {
      approved: "ACCEPTED"
    }
  });  
  return (
    <div className="rounded-2xl odd:bg-aamPurple even:bg-aamYellow p-4 capitalize flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white py-1 px-2 rounded-full text-green-600">
          {new Date().getFullYear()}/{(new Date().getFullYear() + 1).toString().slice(-2)}
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;
