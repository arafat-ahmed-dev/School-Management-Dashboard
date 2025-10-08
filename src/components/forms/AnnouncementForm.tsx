
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useEffect, useState, useRef } from "react";
import { getAllClasses, createAnnouncement, updateAnnouncement } from "@/app/actions/actions";
import { toast } from "sonner";

const schema = z.object({
    title: z.string().min(1, { message: "Title is required!" }),
    description: z.string().min(1, { message: "Description is required!" }),
    date: z.string().min(1, { message: "Date is required!" }),
    classId: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const AnnouncementForm = ({ type, data, onSuccess }: {
    type: "create" | "update";
    data?: any;
    onSuccess?: () => void;
}) => {
    const [classes, setClasses] = useState<any[]>([]);
    const [showClassDropdown, setShowClassDropdown] = useState(false);
    const [classSearch, setClassSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const classDropdownRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: data?.title || "",
            description: data?.description || "",
            date: data?.date ? new Date(data.date).toISOString().split('T')[0] : "",
            classId: data?.classId || "",
        },
    });

    const selectedClass = watch("classId");

    useEffect(() => {
        (async () => {
            const classesData = await getAllClasses();
            setClasses(classesData);
        })();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (classDropdownRef.current && !classDropdownRef.current.contains(event.target as Node)) {
                setShowClassDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(classSearch.toLowerCase()) ||
        cls.classId.toLowerCase().includes(classSearch.toLowerCase())
    );

    const onSubmit = handleSubmit(async (formData) => {
        setIsSubmitting(true);
        try {
            const announcementData = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                ...(formData.classId && { classId: formData.classId }),
            };

            if (type === "create") {
                const result = await createAnnouncement(announcementData);
                if (result.error) {
                    toast.error("Failed to create announcement: " + result.error);
                } else {
                    toast.success("Announcement created successfully!");
                    reset();
                    onSuccess?.();
                }
            } else {
                const result = await updateAnnouncement(data?.id, announcementData);
                if (result.error) {
                    toast.error("Failed to update announcement: " + result.error);
                } else {
                    toast.success("Announcement updated successfully!");
                    onSuccess?.();
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new announcement" : "Update announcement"}
            </h1>

            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Title"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />

                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs font-medium text-gray-500">Description *</label>
                    <textarea
                        {...register("description")}
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={4}
                        placeholder="Enter announcement description..."
                    />
                    {errors.description && (
                        <p className="text-xs text-red-400">{errors.description.message}</p>
                    )}
                </div>

                <InputField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={data?.date ? new Date(data.date).toISOString().split('T')[0] : ""}
                    register={register}
                    error={errors?.date}
                />

                {/* Class Selection */}
                <div className="relative flex w-full flex-col gap-2 md:w-1/4" ref={classDropdownRef}>
                    <label className="text-xs font-medium text-gray-500">Class (Optional)</label>
                    <div
                        className="w-full cursor-pointer rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        onClick={() => setShowClassDropdown(!showClassDropdown)}
                    >
                        {selectedClass ?
                            classes.find(c => c.id === selectedClass)?.name || "All Classes" :
                            "All Classes"
                        }
                    </div>
                    {showClassDropdown && (
                        <div className="absolute inset-x-0 top-full z-10 max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                            <input
                                type="text"
                                placeholder="Search classes..."
                                value={classSearch}
                                onChange={(e) => setClassSearch(e.target.value)}
                                className="w-full border-b border-gray-200 p-2"
                            />
                            <div
                                className="cursor-pointer p-2 hover:bg-gray-100"
                                onClick={() => {
                                    setValue("classId", "");
                                    setShowClassDropdown(false);
                                    setClassSearch("");
                                }}
                            >
                                <div className="font-medium">All Classes</div>
                            </div>
                            {filteredClasses.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="cursor-pointer p-2 hover:bg-gray-100"
                                    onClick={() => {
                                        setValue("classId", cls.id);
                                        setShowClassDropdown(false);
                                        setClassSearch("");
                                    }}
                                >
                                    <div className="font-medium">{cls.name}</div>
                                    <div className="text-xs text-gray-500">ID: {cls.classId}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button
                className="rounded-md bg-blue-400 p-2 text-white hover:bg-blue-500 disabled:bg-gray-400"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ?
                    (type === "create" ? "Creating..." : "Updating...") :
                    (type === "create" ? "Create" : "Update")
                }
            </button>
        </form>
    );
};

export default AnnouncementForm;
