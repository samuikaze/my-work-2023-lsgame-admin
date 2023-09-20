import { Modal } from "bootstrap";

export declare interface AddNews {
  newsTitle: string | null;
  newsTypeId: number | null;
  newsContent: string | null;
}

export declare interface NewsListResponse {
  newsList: Array<News>;
  totalPages: number;
}

export declare interface NewsList {
  newsList: Array<News>;
  totalPages: number;
}

export declare interface News {
  newsId: number;
  newsTypeId: number;
  newsTitle: string;
  newsContent: string;
  createdUserId?: number | null;
  createdAt?: Date | null;
  updatedUserId?: number | null;
  updatedAt?: Date | null;
  deletedUserId?: number | null;
  deletedAt?: Date | null;
}

export declare interface NewsType {
  newsTypeId: number;
  name: string;
  createdUserId: number | null;
  createdAt: Date | null;
  updatedUserId: number | null;
  updatedAt: Date | null;
}

export declare interface PageInformation {
  currentPage: number;
  totalPage: number;
}

export declare interface Modals {
  [key: string]: Modal
}

export declare interface NewsManagementStatuses {
  retrieving: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

export declare type AsNewsType = 'update' | 'delete';
