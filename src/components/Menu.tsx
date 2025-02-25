"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import _ from "lodash";
import { LogoutModal } from "./LogoutModal";
import { useAppSelector } from "@/lib/store/hooks";

const Menu = () => {
  const [isClient, setIsClient] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const response = useAppSelector((state) => state.auth?.userData?.userRole);
  const role = _.toLower(response);
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
        {
          icon: "/profile.png",
          label: "Profile",
          href: "/profile",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/setting.png",
          label: "Settings",
          href: "/settings",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "/logout",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div
        className={`mt-4 text-sm pb-4 ${
          showLogoutModal ? "opacity-50" : ""
        } overflow-y-auto max-h-[80vh] sm:max-h-[90vh] `}
      >
        {" "}
        {/* Add opacity when modal is visible */}
        {menuItems.map((i) => (
          <div className="flex flex-col gap-2" key={i.title}>
            <span className="hidden lg:block text-gray-400 font-light my-2">
              {i.title}
            </span>
            {i.items.map((item) => {
              if (item.visible.includes(role)) {
                return item.label === "Logout" ? (
                  <button
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-3 text-gray-500 py-2 md:px-2 rounded-md hover:bg-aamSkyLight"
                    onClick={() => setShowLogoutModal(true)} // Show LogoutModal on click
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={20} // Default size for mobile
                      height={20}
                      className="sm:w-5 sm:h-5" // Adjust size based on screen size
                    />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-3 text-gray-500 py-2 md:px-2 rounded-md hover:bg-aamSkyLight"
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={20} // Default size for mobile
                      height={20}
                      className="sm:w-5 sm:h-5 md:w-6 md:h-6 " // Adjust size based on screen size
                    />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              }
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
