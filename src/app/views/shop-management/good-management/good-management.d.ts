import { Modal } from "bootstrap";

export declare interface Good {
  goodId: number;
  name: string;
  previewImagee?: string;
  description: string;
  price?: number;
  quantity?: number;
  status: number;
  createdUserId?: number;
  createdAt?: Date;
  updatedUserId?: number;
  updatedAt?: Date;
}

export declare interface AddGood {
  name: string;
  previewImagee?: string;
  description: string;
  price?: number;
  quantity?: number;
}

export declare interface PageInformation {
  currentPage: number;
  totalPage: number;
}

export declare interface Modals {
  [key: string]: Modal
}

export declare interface GoodManagementStatuses {
  retrieving: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

export declare interface SelectedImage {
  dataurl: string;
  filename: string;
  size: number;
}

export declare type AsGoodType = 'update' | 'delete';
