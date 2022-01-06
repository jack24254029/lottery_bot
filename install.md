# 安裝教學

安裝過程中會使用到以下服務
- Line Messaging API
- Google Apps Script
- Google Sheet API
- Google Cloud Platform (除錯才會使用到)

## 申請 Line Messaging API

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

  
