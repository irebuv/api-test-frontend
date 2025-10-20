import MainLayout from "@/layouts/main-layout";
import BusinessList from "@/pages/public/business/components/business-list";
import React, {useState} from "react";
import {Pagination} from "@/components/ui/custom/pagination";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import type {BusinessResponse} from "@/types/businesses";
import {useAuth} from "@/context/AuthContext";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import CustomModalForm from "@/components/custom-modal-form";
import DialogRequestShow from "@/pages/public/business/components/request-modal";
import {useApiForm} from "@/hooks/useApiForm";
import {useQueryData} from "@/hooks/useQueryData";

export default function Businesses() {
    const {data, filters, setFilters, refetch} = useQueryData<BusinessResponse, {
        type: string;
        myProjects: number | string;
        page: number;
    }>({
        url: "/businesses",
        initial: {type: "all", myProjects: 0, page: 1},
    });

    const businessesFields = [
        {id: "name", name: "name", label: "Name", type: "text"},
        {id: "description", name: "description", label: "Description", type: "textarea"},
        {id: "type", name: "type", label: "Type", type: "select"},
        {id: "image", name: "image", label: "Image", type: "file"},
    ];
    const requestFields = [
        {id: "name", name: "name", label: "Name", type: "text"},
        {id: "phone", name: "phone", label: "Phone", type: "text"},
        {id: "date", name: "date", label: "Choose correct date", type: "date-select"},
        {id: "description", name: "description", label: "Description", type: "textarea"},
    ];
    /*-----------Form block start-----------*/
    /*-----------Form block start-----------*/
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "createRequest" | "edit">("create");
    const [editingId, setEditingId] = useState<number | null>(null);
    const {
        data: businessData,
        setData: setBusinessData,
        reset: resetBusiness,
        errors: businessErrors,
        processing: businessProcessing,
        submit: submitBusiness
    } = useApiForm({
        name: "",
        description: "",
        image: null as File | null,
        type: "",
    });
    const {
        data: requestData,
        setData: setRequestData,
        reset: resetRequest,
        errors: requestErrors,
        processing: requestProcessing,
        submit: submitRequest
    } = useApiForm({
        name: "",
        phone: "",
        date: "",
        description: "",
    });
    const openCreate = () => {
        resetBusiness();
        resetRequest();
        setMode("create");
        setEditingId(null);
        setModalOpen(true);
    };
    const onCreateRequest = (businessId: number) => {
        resetRequest();
        resetBusiness();
        setMode("createRequest");
        setEditingId(businessId);
        setModalOpen(true);
    }
    const openEdit = (item: any) => {
        resetRequest();
        resetBusiness({
            name: item.name ?? "",
            description: item.description ?? "",
            image: null,
            type: item.type ?? "",
        });
        setMode("edit");
        setEditingId(item.id);
        setModalOpen(true);
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
            submitBusiness("/businesses", "post", commonOptions);
        } else if (mode === "edit" && editingId) {
            submitBusiness(`/businesses/${editingId}`, "put", commonOptions);
        } else if (mode === "createRequest" && editingId) {
            submitRequest(`/businesses/request/${editingId}`, "post", commonOptions);
        }
    };
    /*-----------Form block end-----------*/
    /*-----------Form block end-----------*/
    const {user} = useAuth();

    const handleDelete = (id: number) => {
        submitBusiness(`/businesses/${id}`, "delete", {
            onSuccess: () => {
                setModalOpen(false);
                refetch();
            }
        });
    }
    return (
        <MainLayout className="mx-auto mt-5 flex max-w-[1150px] flex-col gap-5 px-7">

            <div className={'flex items-center'}>
                <div className={'w-[200px]'}>
                    <Select
                        value={filters.type}
                        onValueChange={(value) => setFilters({type: value})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`All`}></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {data?.types?.map((el) => (
                                <SelectItem key={el} value={el}>{el}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="ml-auto">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <label htmlFor="myBusinesses"
                                   className={'flex w-full cursor-pointer items-center justify-end p-2'}>
                                <span>Only my projects</span>
                                &nbsp;&nbsp;
                                <Input
                                    className={'w-[30px] cursor-pointer'}
                                    id="myBusinesses"
                                    type={'checkbox'}
                                    checked={data?.myProjects == 1}
                                    onChange={(e) => setFilters({myProjects: e.target.checked ? 1 : 0})}
                                />
                            </label>
                            <DialogRequestShow myRequests={data?.myRequests ?? []} unreadCount={data?.unreadCount ?? 0} refetch={refetch}/>
                            <Button type="button" className="cursor-pointer px-4" onClick={openCreate}>Create
                                Business</Button>
                        </div>
                    ) : (
                        <Button disabled>Log in to add a project...</Button>
                    )}
                </div>
            </div>

            <CustomModalForm
                open={modalOpen}
                onOpenChange={setModalOpen}
                title={mode === "create" ? "Create Business" : mode === "edit" ? "Edit Business" : "Create Request"}
                description={mode === "create" ? "Create new" : mode === "edit" ? "Edit existing" : "Create a new request"}
                fields={mode === "createRequest" ? requestFields : businessesFields}
                data={mode === "createRequest" ? requestData : businessData}
                setData={mode === "createRequest" ? setRequestData : setBusinessData}
                errors={mode === "createRequest" ? requestErrors : businessErrors}
                processing={mode === "createRequest" ? requestProcessing : businessProcessing}
                onSubmit={handleSubmit}
                submitLabel={mode === "edit" ? "Save" : "Create"}
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
