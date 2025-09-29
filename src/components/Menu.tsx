"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoutModal } from "./LogoutModal";
import { useSessionData } from "@/hooks/useSessionData";

const Menu = () => {
  const [isClient, setIsClient] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, isLoading } = useSessionData();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const role = user?.role;
  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: `/${role}`,
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/teacher.png",
          label: "Teachers",
          href: "/list/teachers",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/student.png",
          label: "Students",
          href: "/list/students",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/parent.png",
          label: "Parents",
          href: "/list/parents",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/subject.png",
          label: "Subjects",
          href: "/list/subjects",
          visible: ["admin"],
        },
        {
          icon: "/class.png",
          label: "Classes",
          href: "/list/classes",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/lesson.png",
          label: "Lessons",
          href: "/list/lessons",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/exam.png",
          label: "Exams",
          href: "/list/exams",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/assignment.png",
          label: "Assignments",
          href: "/list/assignments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/result.png",
          label: "Results",
          href: "/list/results",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/attendance.png",
          label: "Attendance",
          href: "/list/attendance",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/calendar.png",
          label: "Events",
          href: "/list/events",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/calendar.png",
          label: "Calendar",
          href: "/list/calendar",
          visible: ["admin"],
        },
        {
          icon: "/announcement.png",
          label: "Announcements",
          href: "/list/announcements",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/approvement.png",
          label: "Approvements",
          href: "/list/approvements",
          visible: ["admin"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        // {
        //   icon: "/setting.png",
        //   label: "Settings",
        //   href: "/list/settings",
        //   visible: ["admin", "teacher", "student", "parent"],
        // },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "/logout",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
  ];

  if (!isClient || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className={`mt-4 pb-4 text-sm ${showLogoutModal ? "opacity-50" : ""
          } max-h-[80vh] overflow-y-auto sm:max-h-[90vh] `}
      >
        {" "}
        {/* Add opacity when modal is visible */}
        {menuItems.map((i) => (
          <div className="flex flex-col gap-2" key={i.title}>
            <span className="my-2 hidden font-light text-gray-400 lg:block">
              {i.title}
            </span>
            {i.items.map((item) => {
              if (item.visible.includes(role as string)) {
                return item.label === "Logout" ? (
                  <button
                    key={item.label}
                    className="flex items-center justify-center gap-3 rounded-md py-2 text-gray-500 hover:bg-aamSkyLight md:px-2 lg:justify-start"
                    onClick={() => setShowLogoutModal(true)} // Show LogoutModal on click
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={20} // Default size for mobile
                      height={20}
                      className="sm:size-5" // Adjust size based on screen size
                    />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center gap-3 rounded-md py-2 text-gray-500 hover:bg-aamSkyLight md:px-2 lg:justify-start"
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={20} // Default size for mobile
                      height={20}
                      className="sm:size-5 md:size-6 " // Adjust size based on screen size
                    />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        ))}
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        />
      </div>
    </>
  );
};

export default Menu;
