interface User {
    phone: string;
}

interface Business {
    id: number;
    user_id: number;
    image_original: string;
    name: string;
    type: string;
    description: string;
    user: User;
}

interface Order {
    id: string;
    name: string;
    is_read: boolean;
    phone: string;
    date: string;
    business_name: string;
    business_image: string;
    description: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface BusinessResponse {
    businesses: PaginatedResponse<Business>;
    types?: string[];
    unreadCount?: number;
    myRequests: Order[];
    myProjects?: number;
    page?: number;
}