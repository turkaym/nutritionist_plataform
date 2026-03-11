export interface DateRangeFilter {
    from?: Date;
    to?: Date;
}

export interface SearchFilter {
    search?: string;
}

export interface StatusFilter<TStatus extends string = string> {
    status?: TStatus;
}

