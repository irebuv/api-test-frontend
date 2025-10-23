import React, { useState } from "react";
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
    errors: Record<string, string | string[] | undefined>;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel?: string;
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
    errors,
    onSubmit,
    submitLabel = "Submit",
}: Props) {
    const [selectedDate, setSelectedDate] = useState<Date>();
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
                                <input
                                    id={f.id}
                                    name={f.name}
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            f.name,
                                            e.target.files
                                                ? e.target.files[0]
                                                : null
                                        )
                                    }
                                />
                            ) : f.type === "select" ? (
                                <Select
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
                            disabled={processing}
                            className="cursor-pointer"
                        >
                            {processing ? "Saving..." : submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
