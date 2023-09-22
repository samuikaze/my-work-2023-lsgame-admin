import { BaseStatuses } from "src/app/commons/abstracts/common";

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

export declare interface GoodManagementStatuses extends BaseStatuses {}

export declare type AsGoodType = 'update' | 'delete';
