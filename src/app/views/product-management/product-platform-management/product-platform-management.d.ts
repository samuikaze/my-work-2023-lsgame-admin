import { BaseStatuses } from "src/app/commons/abstracts/common";

export declare interface ProductPlatform {
  productPlatformId: number;
  productPlatformName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export declare interface AddProductPlatform {
  productPlatformName: string;
}

export declare interface ProductPlatformManagementStatuses extends BaseStatuses {}

export declare type AsProductPlatformType = 'update' | 'delete';
