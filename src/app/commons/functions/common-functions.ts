import { HttpErrorResponse } from '@angular/common/http';

/**
 * 處理 API 呼叫錯誤
 * @param errors 錯誤資訊
 */
export function handleHttpClientError(errors: HttpErrorResponse): void {
  console.error(errors);

  if (errors.status >= 400 && errors.status < 500) {
    throw Error(`An user side error occurred: ${errors.error.message}`);
  } else if (errors.status >= 500) {
    throw Error(`An unexpected error occurred: ${errors.error.message}`);
  }
}

/**
 * 檢查輸入資料是否為 null、undefined 或 空字串
 * @param input 輸入資料
 * @returns 是否為空值
 */
export function checkNullAndEmpty(input: any): boolean {
  if (typeof input === "string") {
    return (
      input === null ||
      input === undefined ||
      input.length === 0
    );
  } else {
    return (
      input === null ||
      input === undefined
    );
  }
}
