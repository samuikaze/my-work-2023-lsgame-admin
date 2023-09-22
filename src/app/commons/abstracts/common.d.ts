import { Modal } from "bootstrap";

export declare interface BaseResponse<T> {
  status: number;
  message: string|null;
  data: T;
}

export declare interface SystemVariable {
  id: number;
  type: string;
  key: string;
  value: string;
  description: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export declare interface User {
  id?: number;
  name?: string;
  account?: string;
  email?: string;
  email_verified_at?: string;
  roles?: Role[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export declare interface Role {
  id: number;
  name: string;
}

export declare interface Breadcrumb {
  title: string;
  uri: string;
}

export declare interface Modals {
  [key: string]: Modal;
}

export declare interface PageInformation {
  currentPage: number;
  totalPage: number;
}

export declare interface SelectedImage {
  dataurl: string;
  filename: string;
  size: number;
}

export declare interface BaseStatuses {
  retrieving: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}
