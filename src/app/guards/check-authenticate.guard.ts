import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common-service/common.service';

/**
 * 驗證登入權杖是否有效 (離線驗證，過期不會重取權杖)
 * @param route
 * @param state
 * @returns 是否登入
 */
export const checkAuthenticateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  return new Promise<boolean>(async (resolve, reject) => {
    const commonService = inject(CommonService);
    const router = inject(Router);
    const authed = await commonService.checkAuthenticateState();

    if (! authed) {
      router.navigate(['/']);
      return;
    }

    resolve(authed);
  });
}
