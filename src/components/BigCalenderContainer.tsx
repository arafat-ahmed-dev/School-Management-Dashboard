import React from "react";
import BigCalender from "@/components/BigCalender";

const BigCalenderContainer = ({
    type,
    id,
}: {
    type: string;
    id: string;
}) => {
    return (
        <div className="rounded-md bg-white p-4">
            <BigCalender />
        </div>
    );
};

export default BigCalenderContainer;
