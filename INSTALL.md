# 架設教學

架設過程中會使用到以下服務，過程中無須安裝任何軟體，只需要有網路就可以實作

- Line Messaging API
- Google Apps Script
- Google Sheet API
- RANDOM.org API
- Google Cloud Platform (除錯才會使用到)

# 目錄

- [申請 Line Messaging API](#申請-line-messaging-api)
- [建立 Google Sheet](#建立-google-sheet)
- [建立 Google Apps Script](#建立-google-apps-script)
- [建立 GCP 專案 (非必要)](#建立-gcp-專案)

# 申請 Line Messaging API

- 打開 https://developers.line.biz/en/services/messaging-api/ ，點選 `Start now`

  <img src="https://user-images.githubusercontent.com/13265628/148399760-8407075b-7d24-4437-a441-39a34a93e34b.png" width="800" />

- 登入自己的 Line 帳號後，會看到以下畫面

  <img src="https://user-images.githubusercontent.com/13265628/148400197-416536ee-1b2b-4864-aa10-19aa2da10274.png" width="800" />
  
  - `Channel type` 選擇 `Messaging API`
  - `Provider` 選擇自己的帳號
  - `Channel name` 機器人要叫什麼名字
  - `Channel description` 對於這個機器人的描述
  - `Category` 分類隨意選，我是選 `生活相關服務`
  - `Subcategory` 子分類隨意，我是選 `生活相關服務(其他)`
  
  必填的都填完之後，最下面的條款勾一勾，就可以建立機器人了。
  
  <img src="https://user-images.githubusercontent.com/13265628/148401231-1cbc6833-e4c8-495c-ae02-ec4a1a6b6c52.png" width="800" />

- 成功建立出機器人之後，切到 `Messaging API` 的分頁，往下滑動到 `LINE Official Account features` 的標題，點選紅圈的地方

  <img src="https://user-images.githubusercontent.com/13265628/148401700-a061c3f6-65e1-4987-95e3-69479e518929.png" width="800" /> 
  
- 瀏覽器會自動打開 `LINE Official Account Manager` 的網頁，原本的網頁不要關哦，後續還會用到

  <img src="https://user-images.githubusercontent.com/13265628/148402079-e7725e65-8230-4cf5-b81b-47c1d982cec6.png" width="800" />

- 往下滑動到 `功能切換` 的地方，按照以下圖片設定
  
  <img src="https://user-images.githubusercontent.com/13265628/148402371-b6ad0861-6afb-41a4-ac14-496ad70e3378.png" width="800" />

- 左邊選單點選 `回應設定`，按照以下圖片設定

  <img src="https://user-images.githubusercontent.com/13265628/148402600-e49baa0a-a745-4d82-b0fa-1c1dd525abe0.png" width="800" />
  
- 接下來，再回到一開始申請機器人的網頁，一樣是在 `Messaging API` 的分頁，往下拉到最下面 `Channel access token` 的地方，點選 `Issue` 的按鈕，會產出像亂碼的一長串文字，這串文字非常重要，不能透露給別人，也不要隨便按下 `Reissue` 的按鈕

  <img src="https://user-images.githubusercontent.com/13265628/148405286-74fdb81d-4f7c-4c52-bfac-132204b4399d.png" width="800" />

- 在相同的頁面往上拉，會看到一個 QR code，用 Line 掃描這個 QR code 就可以加入這個機器人到你的好友跟群組裡面了
- 恭喜你，你的 Line 機器人設定已經完成 99% 了。

# 建立 Google Sheet

這個階段，我們會用自己的 Google Drive 建立一個 Google Sheet ，也就是 Google 的 Excel
這個 Sheet 是要用來記錄要抽什麼、誰登記要抽什麼，也就是當作一個小型資料庫使用

- 打開 Google Drive
  
  > https://drive.google.com/drive/my-drive

- 新增 -> Google 試算表
  
  > 你可以為試算表命名，避免之後清理 Google Drive 的時候誤刪

- 新增一個工作表，叫 `Log`

  > 這個工作表可以用來記錄一些 Debug 用的資訊，後續會在這邊取得 Line 群組的 ID
- A1 欄位填上 `Timestamp`
- B1 欄位填上 `Log`
- 這邊有一個東西非常重要，叫做 `SheetID` ，他就在網址列上面，後續會使用到

  > `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit#gid=0`
  
  <img src="https://user-images.githubusercontent.com/13265628/148408332-dcbf6e41-816e-4af6-879b-c03677328e38.png" width="800" />

- 開啟共用 -> 知道連結的人都可以進行編輯

  > 這個連結也不要隨便給別人，不然他可以直接修改裡面的資料
  
  <img src="https://user-images.githubusercontent.com/13265628/148416879-0ba33d94-ceb9-4c2b-a704-e002c5704e17.png" width="600" />

- 再度恭喜你，到這邊大致上已經完成建立 Google Sheet 的流程了。

# 建立 Google Apps Script

這個階段要開始實作最主要的功能了，一樣會使用自己的 Google Drive 來建立 Google Apps Script

- 打開 Google Drive
  
  > https://drive.google.com/drive/my-drive

- 新增 -> 更多 -> Google Apps Script
- 新增完成後，就會看到這個以下頁面

  > 當然也可以為這個檔案進行命名，避免未來的自己誤刪
  
  <img src="https://user-images.githubusercontent.com/13265628/148409587-fbe1ed05-9b20-4dce-acb7-bc6daeef4798.png" width="800" />

- 再來就是把 `src` 資料夾底下的程式碼複製過去

  - Configs.gs
  - Main.gs
  - SheetUtils.gs
  - Utils.gs

  > 如何修改檔名 (可以不用打 `.gs`)
  > 
  > <img src="https://user-images.githubusercontent.com/13265628/148411730-b1c4ab39-2080-457f-9a33-885385cd2275.png" height="200" />
  
  > 如何新增檔案 (此專案是選擇 `指令碼`)
  >
  > <img src="https://user-images.githubusercontent.com/13265628/148412131-9ed5e454-bc1b-4c8e-85a6-c4d02b32d3be.png" height="200" />

- 都複製過去後，打開 https://www.random.org/ 申請取得亂數需要用到的 API Key

  - 點擊左上的 `Login`
  
    <img src="https://user-images.githubusercontent.com/13265628/148413421-93712c22-f04a-4724-9cdc-9cd44cf8a15b.png" widht="800" />

  - 點選 `Sign Up Now`
  
    <img src="https://user-images.githubusercontent.com/13265628/148413638-33ce2ac1-cf05-4f92-bc1c-021c751279c5.png" width="800" />

  - 註冊完成並且登入後，拉到 `API Services` 的地方，點選 `Use this Service`
  
    <img src="https://user-images.githubusercontent.com/13265628/148413970-91cd8b57-ea7e-46f1-a389-63a8d43a6adf.png" width="800" />
  
  - 點選 `Create a New API Key`， `Key Name` 隨意填上 (至少 8 個字)，其餘都照著以下截圖
  
    > 這個專案是使用在特定的 Line 群組上面，在正常的使用情況下，API 的使用數量是不會超過免費的額度
    
    <img src="https://user-images.githubusercontent.com/13265628/148414286-da1e7d27-9c8d-48a2-ac3c-85a640ee3e74.png" width="600" />
    
    <img src="https://user-images.githubusercontent.com/13265628/148414790-ac168c43-3cc8-4ac0-9560-9d502bae24de.png" width="600" />

  - 點進去剛剛建立好的 API Key，複製第一個 API Key
  
    > 這邊的 API Key 嚴禁透露給任何人

    <img src="https://user-images.githubusercontent.com/13265628/148415512-0468203a-7ec7-4943-b263-6527fe3b983e.png" width="600" />

  - 到這裡就完成申請了。

- 回到 Google Apps Script 的編輯畫面，切換到 `Config.gs` 的檔案
  > 貼上的時候單引號要記得留著
  > 
  > ex: 'ABCDEFG'
  
  - `CHANNEL_ACCESS_TOKEN` 填上先前按下 `Issue` 按鈕產生的那串文字
  - `TARGET_GROUP_ID` 要等到 Apps Sciprt 部署後才能拿到，之後再回頭來填
  - `SHEET_ID` 填上建立 Google 試算表時提及的 `SheetID`
  - `RANDOM_API_KEY` 填上在 RANDOM.org 申請好的 API Key

- 開始部署我們的 Apps Scripts，先儲存，再點選右上角的 `部署` -> `新增部署作業`，選取類型旁邊有個齒輪，點開來，勾選 `網頁應用程式`

  <img src="https://user-images.githubusercontent.com/13265628/148416213-fb8942d1-4cc2-4817-8779-2efeea7e6bc0.png" width="800" />

  - 新增說明，可隨意打，我自己是會打這是第幾版，所以我填 1
  - 執行身份選自己
  - 誰可以存取選 `所有人`

    <img src="https://user-images.githubusercontent.com/13265628/148417897-cf345d49-22f2-4b1c-b606-01320e510fdb.png" width="600" />

- 按下 `部署` 後，會跳出以下頁面，點選 `授予存取權` -> 選取自己的帳號 -> 進階 -> 點選 `前往「XXX」(不安全)`

  > 為什麼會說這個不安全呢？因為現階段還是處於測試階段，所以 Google 會認為他不安全
  > 別擔心，這個完全不會有個資或其他安全疑慮，請安心服用。
  > 如有疑慮，請立即停止操作

  <img src="https://user-images.githubusercontent.com/13265628/148418114-e32e04d1-64bd-413f-9d8d-d1458ed51aa5.png" height="400" />
  
  <img src="https://user-images.githubusercontent.com/13265628/148418442-088e5c72-5dd2-4384-85b6-9340f7accee5.png" height="400" />

- 完成部署後，複製網頁應用程式的網址並貼到 Line Messaging API 的頁面，點選 `Update`，`Use webhook` 的開關打開

  <img src="https://user-images.githubusercontent.com/13265628/148419135-9366c99c-36fa-4367-9372-1914432c73fa.png" width="800" />

  <img src="https://user-images.githubusercontent.com/13265628/148419446-e048df36-dfe5-4ca0-9c0a-5a1f3d1c8745.png" width="800" />

  <img src="https://user-images.githubusercontent.com/13265628/148419721-fb6d4d7d-42a3-4880-9eef-c22f7adff4df.png" width="800" />

- 接著把機器人加到 Line 群組裡面，隨便輸入一句話讓機器人已讀，藉此來取得這個群組的 Group ID
- 以上步驟如果都正確的話，就會在 Log 的工作表看到 Log 了，裡面就可以找到 `groupId`，並把他填到 `Configs.gs` 裡面的 `TARGET_GROUP_ID`
  
  <img src="https://user-images.githubusercontent.com/13265628/148421559-9f5084cf-71ad-4372-9456-74202b7ded8a.png" width="800" />
  
- 完成之後，再去 `Main.gs` 把第 21 行刪掉

  > 也可以不刪，但是任何人在群組所說的話都會變成 Log 儲存在試算表，請自行斟酌

- 儲存專案，點選右上 `部署` -> `管理部署作業` -> 點選右上的筆 (編輯) -> 版本 -> 建立新版本 -> `部署`

  <img src="https://user-images.githubusercontent.com/13265628/148422302-359f98b4-44da-48c9-b650-2a4ea8017f3c.png" width="800" />

- 非常非常恭喜你，你已經可以使用相關指令跟抽獎機器人互動了

# 重要：如果機器人突然沒有反應，可能是因為部署時的授權過期導致，到時候可以再來重新部署 (目前此現象無法避免，如有更好的解決方式歡迎提出)

# 建立 GCP 專案

此步驟是發生在不知道為什麼機器人都無法作動的情況下才需要實作的

- 先打開 https://console.cloud.google.com/ 網站
- 新增一個專案，專案名稱隨意
- 建立完成後，選取該專案

  <img src="https://user-images.githubusercontent.com/13265628/148424582-8ffbc70d-a276-4272-9a28-ec315f25df9b.png" width="500" />

- 點選左上的選單 -> `API 和服務` -> `OAuth 同意畫面`

  <img src="https://user-images.githubusercontent.com/13265628/148424664-2461c23c-2a67-4ccd-8985-7fa1a5165fe9.png" height="500" />

- 選擇 `外部`

  <img src="https://user-images.githubusercontent.com/13265628/148424810-1a125b14-c4c4-41ef-9050-ca7486a0d9e4.png" height="500" />
  
- 把必填的填一填， Email 的地方都填自己的，填完後，最下面點選 `儲存並繼續`
- 繼續點選 `儲存並繼續`
- 測試使用者加入自己的 Email，填完後，點選 `儲存並繼續`
- 完成後，點選左上的選單 -> 首頁 -> 資訊主頁，複製專案編號
- 打開先前發布的 Apps Script
- 左邊選單 `專案設定` -> 拉到最下面 -> 點選 `變更專案` -> 填上剛剛複製的專案編號

  <img src="https://user-images.githubusercontent.com/13265628/148425489-b939eab5-aacd-4cbf-9dd6-8b134600ac4d.png" height="300" />
  
  <img src="https://user-images.githubusercontent.com/13265628/148425610-3bd854f7-6bf6-4019-adc6-6168a4da9a35.png" width="800" />
  
- 重新部署專案，會需要重新授權一次
- 回到 GCP 網頁，上方搜尋 `logging`

  <img src="https://user-images.githubusercontent.com/13265628/148425760-ca8a1cef-70d5-4ed7-93bf-87a64613a2df.png" width="800" />

- 點開 `紀錄檔欄位`，選 `Apps Script Function`，再去跟機器人互動，執行查詢一直刷新，過幾秒後，就會看到顯示在 Google 試算表的 Log 也顯示在上面了
  
  > 如果要顯示自訂義的 Log 請到程式碼需要加上 Log 的地方加上 `conoloe.log('你需要的資訊');` 即可
  
  <img src="https://user-images.githubusercontent.com/13265628/148426261-615255e4-9aa8-45bb-a266-85d1808ae0db.png" height="300" />

  <img src="https://user-images.githubusercontent.com/13265628/148427606-e645b5c4-c630-427a-85ce-b5152c0ec579.png" width="800" />
