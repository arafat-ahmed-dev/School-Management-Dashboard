"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getNotificationCounts } from "@/app/actions/actions";

interface NotificationCounts {
    announcements: number;
    messages: number;
}

const NotificationComponent = () => {
    const [counts, setCounts] = useState<NotificationCounts>({
        announcements: 0,
        messages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const checkIfRead = (type: "announcements" | "messages", notificationDate: Date) => {
        if (typeof window === "undefined") return false;

        const readKey = `${type}_last_read`;
        const lastReadTime = localStorage.getItem(readKey);

        if (!lastReadTime) return false;

        const lastRead = new Date(lastReadTime);
        return notificationDate <= lastRead;
    };

    const fetchNotificationCounts = async () => {
        try {
            setIsLoading(true);

            // Use Prisma client directly through server action
            const result = await getNotificationCounts();

            // Check localStorage to see if notifications have been read
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // For announcements, check if user has visited announcements page recently
            const announcementsRead = checkIfRead("announcements", sevenDaysAgo);
            const messagesRead = checkIfRead("messages", sevenDaysAgo);

            setCounts({
                announcements: announcementsRead ? 0 : result.announcements,
                messages: messagesRead ? 0 : result.messages,
            });
        } catch (error) {
            console.error("Error fetching notification counts:", error);
            setCounts({ announcements: 0, messages: 0 });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotificationCounts();

        // Listen for notifications read events
        const handleNotificationsRead = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { type } = customEvent.detail;
            setCounts(prev => ({
                ...prev,
                [type]: 0
            }));
        };

        window.addEventListener('notificationsRead', handleNotificationsRead);

        // Optional: Set up an interval to refresh counts periodically
        const interval = setInterval(fetchNotificationCounts, 60000); // Refresh every minute

        return () => {
            clearInterval(interval);
            window.removeEventListener('notificationsRead', handleNotificationsRead);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return (
            <div className="flex items-center gap-4 md:gap-6">
                <div className="flex size-7 items-center justify-center rounded-full bg-gray-200 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 md:gap-6">
            {/* Announcements */}
            <Link href="/list/announcements">
                <div className="relative flex size-7 cursor-pointer items-center justify-center rounded-full bg-white">
                    <Image src="/announcement.png" alt="announcements" width={20} height={20} />
                    {counts.announcements > 0 && (
                        <span className="absolute -right-3 -top-3 flex size-5 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
                            {counts.announcements > 99 ? '99+' : counts.announcements}
                        </span>
                    )}
                </div>
            </Link>

            {/* Messages - only show when count > 0 (future implementation) */}
            {counts.messages > 0 && (
                <Link href="/list/messages">
                    <div className="relative flex size-7 cursor-pointer items-center justify-center rounded-full bg-white">
                        <Image src="/message.png" alt="messages" width={20} height={20} />
                        <span className="absolute -right-3 -top-3 flex size-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                            {counts.messages > 99 ? '99+' : counts.messages}
                        </span>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default NotificationComponent;