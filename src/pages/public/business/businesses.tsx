import MainLayout from "@/layouts/main-layout";
import BusinessList from "@/pages/public/business/components/business-list";
import React, { useState } from "react";
import { Pagination } from "@/components/ui/custom/pagination";
import type { BusinessResponse } from "@/types/businesses";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomModalForm from "@/components/custom-modal-form";
import DialogRequestShow from "@/pages/public/business/components/request-modal";
import { useApiForm } from "@/hooks/useApiForm";
import { useQueryData } from "@/hooks/useQueryData";
import { validateWithZod, type ClientErrors } from "@/lib/validateWithZod";
import { BusinessSchema } from "@/validation/business";
import { RequestSchema } from "@/validation/request";
import FilterDropdown from "@/components/filter-dropdown";

export default function Businesses() {
    const { data, filters, setFilters, refetch } = useQueryData<
        BusinessResponse,
        {
            type: string;
            myProjects: number | string;
            page: number;
            search: string;
            sort: string;
        }
    >({
        url: "/businesses",
        initial: {
            type: "all",
            myProjects: 0,
            page: 1,
            search: "",
            sort: "id",
        },
    });
    console.log("serverInfo =", (data as any)?.serverInfo ?? "");
    const businessesFields = [
        { id: "name", name: "name", label: "Name", type: "text" },
        {
            id: "description",
            name: "description",
            label: "Description",
            type: "textarea",
        },
        { id: "type", name: "type", label: "Type", type: "select" },
        { id: "image", name: "image", label: "Image", type: "file" },
    ];
    const requestFields = [
        { id: "name", name: "name", label: "Name", type: "text" },
        { id: "phone", name: "phone", label: "Phone", type: "text" },
        {
            id: "date",
            name: "date",
            label: "Choose correct date",
            type: "date-select",
        },
        {
            id: "description",
            name: "description",
            label: "Description",
            type: "textarea",
        },
    ];

    /* ↓↓↓↓↓↓↓↓↓↓↓↓↓ Form block ↓↓↓↓↓↓↓↓↓↓↓↓↓ */
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "createRequest" | "edit">(
        "create"
    );
    const [editingId, setEditingId] = useState<number | null>(null);
    const {
        data: businessData,
        setData: setBusinessData,
        reset: resetBusiness,
        errors: businessErrors,
        processing: businessProcessing,
        submit: submitBusiness,
    } = useApiForm({
        name: "",
        description: "",
        type: "",
        image: null as File | null,
    });
    const {
        data: requestData,
        setData: setRequestData,
        reset: resetRequest,
        errors: requestErrors,
        processing: requestProcessing,
        submit: submitRequest,
    } = useApiForm({
        name: "",
        phone: "",
        date: "",
        description: "",
    });
    const openCreate = () => {
        resetBusiness();
        resetRequest();
        setBizErrors({});
        setReqErrors({});
        setMode("create");
        setEditingId(null);
        setModalOpen(true);
        setIsValid(false);
    };
    const onCreateRequest = (businessId: number) => {
        resetRequest();
        resetBusiness();
        setBizErrors({});
        setReqErrors({});
        setMode("createRequest");
        setEditingId(businessId);
        setModalOpen(true);
        setIsValid(false);
    };
    const openEdit = (item: any) => {
        console.log(item.type);
        resetRequest();
        resetBusiness({
            name: item.name ?? "",
            description: item.description ?? "",
            image: null,
            type: item.type ?? "",
        });
        setBizErrors({});
        setReqErrors({});
        setMode("edit");
        setEditingId(item.id);
        setModalOpen(true);
        setTimeout(
            () =>
                setIsValid(
                    BusinessSchema.safeParse({
                        name: item.name ?? "",
                        description: item.description ?? "",
                        image: null,
                        type: item.type ?? "",
                    }).success
                ),
            0
        );
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const commonOptions = {
            asFormData: true,
            onSuccess: () => {
                resetBusiness();
                setModalOpen(false);
                refetch();
            },
        };

        if (mode === "create") {
            const result = validateWithZod(BusinessSchema, businessData);
            if (!result.ok) {
                setBizErrors(result.errors);
                return;
            }
            setBizErrors({});
            submitBusiness("/businesses", "post", commonOptions);
        } else if (mode === "edit" && editingId) {
            const result = validateWithZod(BusinessSchema, businessData);
            if (!result.ok) {
                setBizErrors(result.errors);
                return;
            }
            setBizErrors({});
            submitBusiness(`/businesses/${editingId}`, "put", commonOptions);
        } else if (mode === "createRequest" && editingId) {
            const result = validateWithZod(RequestSchema, requestData);
            if (!result.ok) {
                setReqErrors(result.errors);
                return;
            }
            setReqErrors({});
            submitRequest(
                `/businesses/request/${editingId}`,
                "post",
                commonOptions
            );
        }
    };
    /* ↑↑↑↑↑↑↑↑↑↑↑↑↑ Form block ↑↑↑↑↑↑↑↑↑↑↑↑↑ */
    /* ↓↓↓↓↓↓↓↓↓↓↓↓↓ Clients errors ↓↓↓↓↓↓↓↓↓↓↓↓↓ */
    const [bizErrors, setBizErrors] = useState<ClientErrors>({});
    const [reqErrors, setReqErrors] = useState<ClientErrors>({});
    const [isValid, setIsValid] = useState(false);

    const mergedBusinessErrors = { ...businessErrors, ...bizErrors };
    const mergedRequestErrors = { ...requestErrors, ...reqErrors };

    const setBusinessField = (name: string, value: any) => {
        setBusinessData(name as any, value);

        const err = validateField(BusinessSchema, name, value);

        setBizErrors((prev) => ({
            ...prev,
            [name]: err ?? "",
        }));

        const allValid = BusinessSchema.safeParse({
            ...businessData,
            [name]: value,
        }).success;
        setIsValid(allValid);
    };

    const setRequestField = (name: string, value: any) => {
        setRequestData(name as any, value);

        const err = validateField(RequestSchema, name, value);

        setReqErrors((prev) => ({
            ...prev,
            [name]: err ?? "",
        }));

        const allValid = RequestSchema.safeParse({
            ...requestData,
            [name]: value,
        }).success;
        setIsValid(allValid);
    };

    const validateField = (schema: any, name: string, value: any) => {
        const shape = schema.shape?.[name];
        if (!shape) return null;
        const result = shape.safeParse(value);
        return result.success ? null : result.error.issues[0].message;
    };
    /* ↑↑↑↑↑↑↑↑↑↑↑↑↑ Clients errors ↑↑↑↑↑↑↑↑↑↑↑↑↑ */

    const { user } = useAuth();
    console.log(filters.type, filters.sort);
    const handleDelete = (id: number) => {
        submitBusiness(`/businesses/${id}`, "delete", {
            onSuccess: () => {
                setModalOpen(false);
                refetch();
            },
        });
    };
    return (
        <MainLayout className="mx-auto mt-5 flex max-w-[1150px] flex-col gap-5 px-7">
            <div className={"flex items-center justify-between"}>
                <FilterDropdown filters={filters} types={data?.types} setFilters={setFilters} />
                <div className="relative max-w-xs">
                    <Input
                        type="search"
                        className="w-[300px]"
                        value={filters.search || ""}
                        onChange={(e) => setFilters({ search: e.target.value })}
                    />
                    {filters.search && (
                        <button
                            type="button"
                            onClick={() => setFilters({ search: "" })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <div>
                    {user ? (
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="myBusinesses"
                                className={
                                    "flex w-auto cursor-pointer items-center justify-end p-2"
                                }
                            >
                                <span>Only my projects</span>
                                &nbsp;&nbsp;
                                <Input
                                    className={"w-[30px] cursor-pointer"}
                                    id="myBusinesses"
                                    type={"checkbox"}
                                    checked={data?.myProjects == 1}
                                    onChange={(e) =>
                                        setFilters({
                                            myProjects: e.target.checked
                                                ? 1
                                                : 0,
                                        })
                                    }
                                />
                            </label>
                            <DialogRequestShow
                                myRequests={data?.myRequests ?? []}
                                unreadCount={data?.unreadCount ?? 0}
                                refetch={refetch}
                            />
                            <Button
                                type="button"
                                className="cursor-pointer px-4"
                                onClick={openCreate}
                            >
                                Create Business
                            </Button>
                        </div>
                    ) : (
                        <Button disabled>Log in to add a project...</Button>
                    )}
                </div>
            </div>

            <CustomModalForm
                open={modalOpen}
                onOpenChange={setModalOpen}
                title={
                    mode === "create"
                        ? "Create Business"
                        : mode === "edit"
                        ? "Edit Business"
                        : "Create Request"
                }
                description={
                    mode === "create"
                        ? "Create new"
                        : mode === "edit"
                        ? "Edit existing"
                        : "Create a new request"
                }
                fields={
                    mode === "createRequest" ? requestFields : businessesFields
                }
                data={mode === "createRequest" ? requestData : businessData}
                setData={
                    mode === "createRequest"
                        ? setRequestField
                        : setBusinessField
                }
                errors={
                    mode === "createRequest"
                        ? mergedRequestErrors
                        : mergedBusinessErrors
                }
                processing={
                    mode === "createRequest"
                        ? requestProcessing
                        : businessProcessing
                }
                onSubmit={handleSubmit}
                submitLabel={mode === "edit" ? "Save" : "Create"}
                isValid={isValid}
            />
            <BusinessList
                onEdit={(el) => openEdit(el)}
                businesses={data?.businesses.data ?? []}
                onCreateRequest={(businessId) => onCreateRequest(businessId)}
                onDelete={(businessId) => handleDelete(businessId)}
            />
            <Pagination
                products={data?.businesses}
                onPageChange={(page) => setFilters({ page })}
            />
        </MainLayout>
    );
}
