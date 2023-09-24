import { BaseStatuses } from "src/app/commons/abstracts/common";

export declare interface ProductType {
  productTypeId: number;
  productTypeName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export declare interface AddProductType {
  productTypeName: string;
}

export declare interface ProductTypeManagementStatuses extends BaseStatuses {}

export declare type AsProductTypeType = 'update' | 'delete';
