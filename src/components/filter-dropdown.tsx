import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
type FilterDropdownProps = {
  filters: {
    type: string;
    sort: string;
    page: number;
  };
  types?: string[];
  setFilters: (filters: Partial<FilterDropdownProps["filters"]>) => void;
};

export default function FilterDropdown({filters, setFilters, types = []} : FilterDropdownProps) {
    return (
        <div className="flex items-center gap-2 w-[200px]">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="min-w-[180px] justify-between cursor-pointer flex items-center"
                    >
                        <div className="w-full">
                            {filters.type !== "all" || filters.sort !== "id" ? (
                                <div className="flex flex-wrap items-center gap-1">
                                    {filters.type && filters.type !== "all" && (
                                        <div className="rounded bg-primary/10 px-2 py-0.5 text-xs">
                                            {filters.type}
                                        </div>
                                    )}
                                    {filters.sort && filters.sort !== "id" && (
                                        <div className="rounded bg-primary/10 px-2 py-0.5 text-xs">
                                            {filters.sort !== "updated_at"
                                                ? filters.sort
                                                : "date"}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>Chose your filters here</div>
                            )}
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                {(filters.type && filters.type !== "all") ||
                (filters.sort && filters.sort !== "id") ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFilters({
                                ...filters,
                                type: "all",
                                sort: "id",
                                page: 1,
                            });
                        }}
                        className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        ✕
                    </button>
                ) : null}
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>
                        <b>Sort by:</b>
                    </DropdownMenuLabel>
                    <Select
                        value={filters.type}
                        onValueChange={(value) => setFilters({ type: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {types?.map((el) => (
                                <SelectItem key={el} value={el}>
                                    {el}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>
                        <b>Filter by:</b>
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={filters.sort ?? "id"}
                        onValueChange={() => {}}
                    >
                        <DropdownMenuRadioItem
                            value="id"
                            onSelect={(e) => e.preventDefault()}
                            onClick={() => setFilters({ sort: "id", page: 1 })}
                        >
                            ID (default)
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                            onSelect={(e) => e.preventDefault()}
                            onClick={() =>
                                setFilters({
                                    sort: "updated_at",
                                    page: 1,
                                })
                            }
                            value="updated_at"
                        >
                            Date
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                            onSelect={(e) => e.preventDefault()}
                            onClick={() =>
                                setFilters({
                                    sort: "popular",
                                    page: 1,
                                })
                            }
                            value="popular"
                        >
                            Popular
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
