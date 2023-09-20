import { Modal } from "bootstrap";

export declare interface Faq {
  faqId: number;
  faqQuestion: string;
  faqAnswer: string;
  createdAt?: Date;
  createdUserId?: number;
  updatedAt?: Date;
  updatedUserId?: number;
}

export declare interface AddFaqRequest {
  faqQuestion: string;
  faqAnswer: string;
}

export declare interface PageInformation {
  currentPage: number;
  totalPage: number;
}

export declare interface GetFaqListResponse {
  faqList: Array<Faq>;
  totalPages: number;
}

export declare interface FaqManagementStatuses {
  retrieving: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

export declare type AsFaqType = 'update' | 'delete';

export declare interface Modals {
  [key: string]: Modal
}
