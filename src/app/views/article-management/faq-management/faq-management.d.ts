import { BaseStatuses } from "src/app/commons/abstracts/common";

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

export declare interface GetFaqListResponse {
  faqList: Array<Faq>;
  totalPages: number;
}

export declare interface FaqManagementStatuses extends BaseStatuses {}

export declare type AsFaqType = 'update' | 'delete';
