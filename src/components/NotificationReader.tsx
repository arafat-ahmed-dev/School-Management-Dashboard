"use client";

import { useEffect } from "react";

interface NotificationReaderProps {
    type: "announcements" | "messages";
}

const NotificationReader = ({ type }: NotificationReaderProps) => {
    useEffect(() => {
        // Mark this notification type as read in localStorage
        const markAsRead = () => {
            const readKey = `${type}_last_read`;
            const currentTime = new Date().toISOString();
            localStorage.setItem(readKey, currentTime);

            // Trigger a custom event to notify other components
            window.dispatchEvent(new CustomEvent('notificationsRead', {
                detail: { type, timestamp: currentTime }
            }));
        };

        markAsRead();
    }, [type]);

    return null; // This component doesn't render anything
};

export default NotificationReader;