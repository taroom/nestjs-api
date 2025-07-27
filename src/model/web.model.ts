export class WebResponse<T> {
    data?: T;
    errors?: string;
    // menambahkan properti paging
    paging?: Paging
}

export class Paging {
    size: number;
    total_page: number;
    current_page: number;
}