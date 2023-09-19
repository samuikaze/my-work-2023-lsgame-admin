# Angular15 Template

這是一個 Angular 15 + Bootstrap 5.2.3 的模板專案，用於快速起始新的專案用

## 撰寫上的注意事項

1. assets 的 URL 不需要以 `/` 開頭，否則在以路徑區分網站的伺服器中 (例: 以 path 做反向代理的 Kubernetes) 會全部得到 404 回應
    > 例: `/assets/test.png` 必須改寫為 `assets/test.png`

## 設定

1. (非必要) 修改 package.json 中 `name` 與 `version`
2. 修改 Dockerfile 中 `RUN ng build -c production --base-href /template/` 的 `--base-href` 值為實際部署的路徑
    > `--base-href` 值請務必以 `/` 結尾，否則除了 index.html 外，全部都會得到 404 回應

    > 若部署非使用 path 方式，則可以將 `--base-href` 後面整個刪除
3. 修改 `.kubernetes` 資料夾下兩個 yaml 檔內容
    > 該資料夾下的 yaml 檔若在 `.yaml` 檔名前加上 `.production`，則該檔案不會進版本控制

    > ingress 的設定檔中 path 與 2. 的 base-href 務必要吻合，否則網頁無法正常顯示

## 參考資料

- [Day20-建立Angular Frontend Docker image](https://ithelp.ithome.com.tw/articles/10207731)
- [Angular URL Rewrite](https://github.com/kubernetes/ingress-nginx/issues/4266#issuecomment-551218413)
- [Angular app on Kubernetes Ingress when using non-root path](https://stackoverflow.com/a/64051684)
- [What's the difference between --base-href and --deploy-url parameters of angular-cli tool](https://stackoverflow.com/a/51185659)
- [Receiving permission denied error with Docker, nginx, uwsgi setup. I can manually write files inside the container](https://stackoverflow.com/a/74543204)
- [access denied for image file server in nginix](https://stackoverflow.com/a/54623331)
- [部署 - Angular](https://angular.tw/guide/deployment#the-base-tag)
- [Module not found: Error: Can't resolve file](https://github.com/angular/angular-cli/issues/4778#issuecomment-280798718)
- [ng generate module](https://angular.io/cli/generate#module)
- [如何透過 Angular CLI 快速將專案全部都轉換成獨立元件架構](https://blog.miniasp.com/post/2023/04/10/Migration-to-Standalone-Component-using-Angular-CLI)
- [Angular App Fails to Build using GitHub Actions ('Cannot find module')](https://stackoverflow.com/a/66729595)
- [Github Actions for NodeJS - 'Error: Cannot find module' for local file](https://stackoverflow.com/a/64359597)
- [git mv and only change case of directory](https://stackoverflow.com/a/3011723)
