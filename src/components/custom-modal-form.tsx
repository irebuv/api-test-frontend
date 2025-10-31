import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/ui/input-error";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { errorToString } from "@/lib/errorToString";

type Field = {
    id: string;
    name: string;
    label: string;
    type?: string; // text, textarea, file, checkbox, etc.
    placeholder?: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    fields: Field[];
    data: Record<string, any>;
    setData: (name: string, value: any) => void;
    processing: boolean;
    uploadingImage: boolean;
    errors: Record<string, string | string[] | undefined>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel?: string;
    isValid: boolean;
};

export default function CustomModalForm({
    open,
    onOpenChange,
    title,
    description,
    fields,
    data,
    setData,
    processing,
    uploadingImage,
    errors,
    onSubmit,
    submitLabel = "Submit",
    isValid,
}: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [dragActive, setDragActive] = useState(false);
    useEffect(() => {
        if (!data.image) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(data.image as File);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [data.image]);
    const handleFile = (name: string, file: File) => {
        if (file && file.type.startsWith("image/")) {
            setData(name, file);
        }
    };
    // drag & drop
    const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover")
            setDragActive(true);
        if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (
        e: React.DragEvent<HTMLLabelElement>,
        fieldName: string
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setData(fieldName, file);
        }
    };
    console.log(data);
    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    {fields.map((f) => (
                        <div key={f.id}>
                            <Label htmlFor={f.id}>{f.label}</Label>

                            {f.type === "textarea" ? (
                                <textarea
                                    id={f.id}
                                    name={f.name}
                                    value={data[f.name] ?? ""}
                                    onChange={(e) =>
                                        setData(f.name, e.target.value)
                                    }
                                    className="w-full border rounded p-2"
                                />
                            ) : f.type === "file" ? (
                                <div className="flex flex-col space-y-3">
                                    <label
                                        htmlFor={f.id}
                                        onDragEnter={handleDrag}
                                        onDragOver={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDrop={(e) => handleDrop(e, f.name)}
                                        className={`relative w-full cursor-pointer rounded-lg border-2 border-dashed p-5 text-center text-sm transition
        ${
            dragActive
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-400 bg-gray-50 text-gray-500 hover:border-blue-500 hover:text-blue-500"
        }`}
                                    >
                                        <input
                                            id={f.id}
                                            name={f.name}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (
                                                    file &&
                                                    file.type.startsWith(
                                                        "image/"
                                                    )
                                                ) {
                                                    setData(f.name, file);
                                                }
                                            }}
                                        />

                                        {/* Если файл выбран, показываем имя */}
                                        {data[f.name] ? (
                                            <span className="block font-medium text-gray-700 truncate max-w-[200px] mx-auto">
                                                {data[f.name]?.name}
                                            </span>
                                        ) : (
                                            <>
                                                <span className="block font-medium">
                                                    Click or drag image here
                                                </span>
                                                <span className="block text-xs text-gray-400 mt-1">
                                                    PNG / JPG, up to 8MB
                                                </span>
                                            </>
                                        )}
                                    </label>

                                    {preview && (
                                        <div className="relative inline-block group cursor-pointer self-start">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="rounded-lg border object-contain max-h-[140px] transition group-hover:opacity-75"
                                            />
                                            <span
                                                onClick={() => {
                                                    setData(f.name, null);
                                                    setPreview(null);
                                                    const input =
                                                        document.getElementById(
                                                            f.id
                                                        ) as HTMLInputElement | null;
                                                    if (input) input.value = "";
                                                }}
                                                className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                            >
                                                Click to remove
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : f.type === "select" ? (
                                <Select
                                    value={data.type || undefined}
                                    onValueChange={(value) =>
                                        setData("type", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Business type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="service">
                                            Service
                                        </SelectItem>
                                        <SelectItem value="shop">
                                            Shop
                                        </SelectItem>
                                        <SelectItem value="cafe">
                                            Cafe
                                        </SelectItem>
                                        <SelectItem value="other">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : f.type === "date-select" ? (
                                <div className="flex flex-col">
                                    <DayPicker
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            setSelectedDate(date);
                                            if (date) {
                                                setData(
                                                    f.name,
                                                    format(date, "yyyy-MM-dd")
                                                );
                                            } else {
                                                setData(f.name, "");
                                            }
                                        }}
                                        className={
                                            "shadow-blue-500 shadow p-3 max-w-max min-h-[372px] border-2"
                                        }
                                    />
                                    <p className="mt-2 text-sm text-gray-600 min-h-[20px]">
                                        {selectedDate ? (
                                            <span>
                                                You picked{" "}
                                                {selectedDate.toDateString()}
                                            </span>
                                        ) : (
                                            <span>Please chose a date!</span>
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <Input
                                    id={f.id}
                                    name={f.name}
                                    value={data[f.name] ?? ""}
                                    onChange={(e) =>
                                        setData(f.name, e.target.value)
                                    }
                                />
                            )}

                            {errors && errors[f.name] && (
                                <InputError
                                    message={errorToString(errors?.[f.name])}
                                />
                            )}
                        </div>
                    ))}

                    {errors && errors._global && (
                        <div className="text-sm text-red-600 dark:text-red-400">
                            {errorToString(errors?._global)}
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={processing || !isValid || uploadingImage}
                            className="cursor-pointer"
                        >
                            {processing
                                ? "Saving..."
                                : uploadingImage
                                ? "Uploading image..."
                                : submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
