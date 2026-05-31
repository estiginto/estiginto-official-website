const state = {
  lessons: [],
  language: "zh-tw",
  category: "all",
  query: "",
  activeId: "",
};

const customLessons = [
  {
    id: "store_management_overview",
    kind: "text",
    title: {
      "zh-tw": "電子商務",
      "zh-cn": "电子商务",
      en: "Ecommerce",
    },
    description: {
      "zh-tw": "商店後台功能教學：商品、訂單、行銷、報表、付款與配送。",
      "zh-cn": "商店后台功能教学：商品、订单、营销、报表、付款与配送。",
      en: "Store admin guide for products, orders, marketing, reports, payments, and shipping.",
    },
    content: {
      "zh-tw": [
        "本教學整理商店後台常用功能，協助你快速理解商店設定、商品管理、訂單管理、行銷、報表、付款、配送與應用程式擴充。",
        "",
        "教學範圍：",
        "1. 商店總覽 Dashboard",
        "2. 銷售管理：訂單 Orders",
        "3. 銷售管理：棄單 Abandoned Carts",
        "4. 銷售管理：顧客 Customers",
        "5. 銷售管理：訂閱商品 Subscriptions",
        "6. 商品目錄：商品 Products",
        "7. 商品目錄：分類 Categories",
        "8. 商品目錄：禮品卡 Gift Cards",
        "9. 商品目錄：匯入與匯出 Data Import and Export",
        "10. 行銷管理：Overview",
        "11. 行銷管理：Google Ads",
        "12. 行銷管理：Retargeting",
        "13. 行銷管理：Facebook Ads",
        "14. 行銷管理：Discount Coupons",
        "15. 行銷管理：Promotions",
        "16. 行銷管理：Newsletters",
        "17. 行銷管理：Automated Emails",
        "18. 報表分析：Overview",
        "19. 報表分析：Visitors",
        "20. 報表分析：Conversion",
        "21. 報表分析：Orders",
        "22. 報表分析：Revenue",
        "23. 報表分析：Marketing",
        "24. 報表分析：Stats",
        "25. 銷售通路：Sell Everywhere",
        "26. 銷售通路：Instagram",
        "27. 銷售通路：Facebook",
        "28. 銷售通路：TikTok",
        "29. 銷售通路：Mobile App",
        "30. 其他通路：Facebook Messenger",
        "31. 其他通路：Google Shopping",
        "32. 其他通路：eBay",
        "33. 其他通路：Amazon",
        "",
        "行銷管理：Overview",
        "這一頁屬於 Store / Third Party Ecommerce 的 Marketing 功能。主要用來集中管理商店的流量取得與轉換工具，例如 Google Ads、Facebook、TikTok、棄單轉換、折扣券、促銷、電子報與自動化 Email。",
        "圖片檔名預留：assets/custom/store-management/marketing-overview.png",
        "",
        "行銷管理：Google Ads",
        "這一頁用來管理自動化 Google 廣告。畫面顯示 Automated Google ads，狀態為 Enabled，可透過 Manage 進入設定。用途是讓商品出現在 Google Shopping 與 Google Ads 相關版位。",
        "圖片檔名預留：assets/custom/store-management/marketing-google-ads.png",
        "",
        "行銷管理：Retargeting",
        "這一頁用來管理 Facebook 自動化再行銷廣告。用途是把曾經瀏覽商店或商品、但尚未完成購買的訪客帶回來。",
        "圖片檔名預留：assets/custom/store-management/marketing-retargeting.png",
        "",
        "行銷管理：Facebook Ads",
        "這一頁是 Facebook 廣告設定指南，包含將商品加入 Facebook、設定 Meta Pixel，以及啟動廣告活動三個步驟。",
        "圖片檔名預留：assets/custom/store-management/marketing-facebook-ads.png",
        "",
        "行銷管理：Discount Coupons",
        "這一頁用來管理折扣碼。可新增 Coupon、查看 Coupon code、折扣類型、有效期限、可用狀態、使用次數與套用範圍，也可連結自動化 Email 發送折扣券。",
        "圖片檔名預留：assets/custom/store-management/marketing-discount-coupons.png",
        "",
        "行銷管理：Promotions",
        "這一頁是促銷活動功能。畫面顯示此功能需升級方案才能建立 Promotions，可用來排程促銷、設定折扣條件，並在促銷開始與結束時自動調整商品價格。",
        "圖片檔名預留：assets/custom/store-management/marketing-promotions.png",
        "",
        "行銷管理：Newsletters",
        "這一頁用來管理電子報。可連接 Mailchimp、匯出 Email 聯絡人，並設定顧客在結帳時是否同意接收行銷 Email。",
        "圖片檔名預留：assets/custom/store-management/marketing-newsletters.png",
        "",
        "行銷管理：Automated Emails",
        "這一頁是自動化 Email 功能。畫面顯示此功能需升級方案才能啟用。用途是依照顧客行為自動寄送 Email，例如提醒顧客回來購買、針對特定情境聯繫顧客、提供折扣或推薦商品。",
        "圖片檔名預留：assets/custom/store-management/marketing-automated-emails.png",
        "",
        "報表分析：Overview",
        "這一頁屬於 Reports and Analytics 總覽。它集中顯示商店內建報表入口，包含訪客、轉換、訂單、營收、行銷來源，以及外部分析工具與分析 App。",
        "圖片檔名預留：assets/custom/store-management/reports-overview.png",
        "",
        "報表分析：Visitors",
        "這一頁用來查看線上商店訪客數、總造訪次數、停留時間、每位訪客造訪次數、瀏覽頁數與跳出率，並可依月份區間比較前後期表現。",
        "圖片檔名預留：assets/custom/store-management/reports-visitors.png",
        "",
        "報表分析：Conversion",
        "這一頁用來查看訪客轉換為顧客的比例，包含總轉換率、新訪客轉換、回訪者轉換、重複訂單轉換，以及行動/桌面訪客轉換。",
        "圖片檔名預留：assets/custom/store-management/reports-conversion.png",
        "",
        "報表分析：Orders",
        "這一頁用來查看商店訂單表現，例如訂單數、每位顧客訂單數、每筆訂單商品數、售出商品數與商店營收。",
        "圖片檔名預留：assets/custom/store-management/reports-orders.png",
        "",
        "報表分析：Revenue",
        "這一頁用來查看商店營收、平均訂單金額、每位顧客平均營收與每位訪客平均營收，也可提示升級以取得更完整財務報表。",
        "圖片檔名預留：assets/custom/store-management/reports-revenue.png",
        "",
        "報表分析：Marketing",
        "這一頁用來查看銷售來源與行銷成效，協助了解行銷活動如何影響商店業績，也可提示升級以取得完整 Marketing reports。",
        "圖片檔名預留：assets/custom/store-management/reports-marketing.png",
        "",
        "報表分析：Stats",
        "這一頁是 Stats 統計總覽，用來查看流量、營收、轉換率、訂單、購買行為、熱門商品、熱門分類等整體營運指標。",
        "圖片檔名預留：assets/custom/store-management/reports-stats.png",
        "",
        "銷售通路：Sell Everywhere",
        "這一頁屬於 Sales Channels 總覽。它集中列出可同步或推廣商品的通路，例如 iOS/Android 行動 App、Instagram Shopping、Facebook Shop、Facebook Messenger、Google Shopping、TikTok 與其他市場平台。",
        "圖片檔名預留：assets/custom/store-management/sales-channels-overview.png",
        "",
        "銷售通路：Instagram",
        "這一頁用來連接 Instagram Shopping，透過 Facebook Page 與 Instagram 帳號串接，讓商品可在 Instagram 上被標記與銷售。",
        "圖片檔名預留：assets/custom/store-management/sales-channel-instagram.png",
        "",
        "銷售通路：Facebook",
        "這一頁用來連接 Facebook Shop，讓商店商品同步到 Facebook，並可搭配 Facebook Ads 進行推廣與再行銷。",
        "圖片檔名預留：assets/custom/store-management/sales-channel-facebook.png",
        "",
        "銷售通路：TikTok",
        "這一頁用來連接 TikTok For Business。截圖顯示 Taiwan 目前不支援 TikTok Business Tools，因此暫時無法啟用 TikTok 廣告串接。",
        "圖片檔名預留：assets/custom/store-management/sales-channel-tiktok.png",
        "",
        "銷售通路：Mobile App",
        "這一頁用來下載或登入商店行動 App。用途是在手機上即時管理訂單、商品、庫存、折扣、棄單與顧客通知。",
        "圖片檔名預留：assets/custom/store-management/sales-channel-mobile-app.png",
        "",
        "其他通路：Facebook Messenger",
        "這一頁用來啟用 Facebook Messenger，讓顧客可以從商品頁直接傳訊息聯絡商店，方便即時客服與回訪溝通。",
        "圖片檔名預留：assets/custom/store-management/other-channel-facebook-messenger.png",
        "",
        "其他通路：Google Shopping",
        "這一頁用來自動化 Google Shopping，並可產生 Google Shopping product feed，上傳到 Google Merchant Center 或用於廣告活動。",
        "圖片檔名預留：assets/custom/store-management/other-channel-google-shopping.png",
        "",
        "其他通路：eBay",
        "這一頁是 eBay 銷售通路功能。畫面顯示需升級方案才能啟用，可將商品刊登到 eBay，並從商店後台管理商品、訂單與庫存同步。",
        "圖片檔名預留：assets/custom/store-management/other-channel-ebay.png",
        "",
        "其他通路：Amazon",
        "這一頁是 Amazon 銷售通路功能。畫面顯示需升級方案才能啟用，可將商品刊登到 Amazon，並從商店後台管理商品與庫存同步。",
        "圖片檔名預留：assets/custom/store-management/other-channel-amazon.png",
      ],
      "zh-cn": [
        "本教学整理商店后台常用功能，协助你快速理解商店设置、商品管理、订单管理、营销、报表、付款、配送与应用程序扩充。",
        "",
        "教学范围：",
        "1. 商店总览 Dashboard",
        "2. 销售管理：订单 Orders",
        "3. 销售管理：弃单 Abandoned Carts",
        "4. 销售管理：顾客 Customers",
        "5. 销售管理：订阅商品 Subscriptions",
        "6. 商品目录：商品 Products",
        "7. 商品目录：分类 Categories",
        "8. 商品目录：礼品卡 Gift Cards",
        "9. 商品目录：导入与导出 Data Import and Export",
        "10. 营销管理：Overview",
        "11. 营销管理：Google Ads",
        "12. 营销管理：Retargeting",
        "13. 营销管理：Facebook Ads",
        "14. 营销管理：Discount Coupons",
        "15. 营销管理：Promotions",
        "16. 营销管理：Newsletters",
        "17. 营销管理：Automated Emails",
        "18. 报表分析：Overview",
        "19. 报表分析：Visitors",
        "20. 报表分析：Conversion",
        "21. 报表分析：Orders",
        "22. 报表分析：Revenue",
        "23. 报表分析：Marketing",
        "24. 报表分析：Stats",
        "25. 销售渠道：Sell Everywhere",
        "26. 销售渠道：Instagram",
        "27. 销售渠道：Facebook",
        "28. 销售渠道：TikTok",
        "29. 销售渠道：Mobile App",
        "30. 其他渠道：Facebook Messenger",
        "31. 其他渠道：Google Shopping",
        "32. 其他渠道：eBay",
        "33. 其他渠道：Amazon",
        "",
        "营销管理：Overview",
        "这一页属于 Store / Third Party Ecommerce 的 Marketing 功能。主要用于集中管理商店的流量获取与转化工具，例如 Google Ads、Facebook、TikTok、弃单转化、优惠券、促销、电子报与自动化 Email。",
        "图片文件名预留：assets/custom/store-management/marketing-overview.png",
        "",
        "营销管理：Google Ads",
        "这一页用于管理自动化 Google 广告。画面显示 Automated Google ads，状态为 Enabled，可通过 Manage 进入设置。用途是让商品出现在 Google Shopping 与 Google Ads 相关版位。",
        "图片文件名预留：assets/custom/store-management/marketing-google-ads.png",
        "",
        "营销管理：Retargeting",
        "这一页用于管理 Facebook 自动化再营销广告。用途是把曾经浏览商店或商品、但尚未完成购买的访客带回来。",
        "图片文件名预留：assets/custom/store-management/marketing-retargeting.png",
        "",
        "营销管理：Facebook Ads",
        "这一页是 Facebook 广告设置指南，包含将商品加入 Facebook、设置 Meta Pixel，以及启动广告活动三个步骤。",
        "图片文件名预留：assets/custom/store-management/marketing-facebook-ads.png",
        "",
        "营销管理：Discount Coupons",
        "这一页用于管理优惠券代码。可新增 Coupon、查看 Coupon code、折扣类型、有效期限、可用状态、使用次数与适用范围，也可连接自动化 Email 发送优惠券。",
        "图片文件名预留：assets/custom/store-management/marketing-discount-coupons.png",
        "",
        "营销管理：Promotions",
        "这一页是促销活动功能。画面显示此功能需升级方案才能建立 Promotions，可用于排程促销、设置折扣条件，并在促销开始与结束时自动调整商品价格。",
        "图片文件名预留：assets/custom/store-management/marketing-promotions.png",
        "",
        "营销管理：Newsletters",
        "这一页用于管理电子报。可连接 Mailchimp、导出 Email 联系人，并设置顾客在结账时是否同意接收营销 Email。",
        "图片文件名预留：assets/custom/store-management/marketing-newsletters.png",
        "",
        "营销管理：Automated Emails",
        "这一页是自动化 Email 功能。画面显示此功能需升级方案才能启用。用途是依照顾客行为自动发送 Email，例如提醒顾客回来购买、针对特定情境联系顾客、提供折扣或推荐商品。",
        "图片文件名预留：assets/custom/store-management/marketing-automated-emails.png",
        "",
        "报表分析：Overview",
        "这一页属于 Reports and Analytics 总览。它集中显示商店内置报表入口，包含访客、转化、订单、营收、营销来源，以及外部分析工具与分析 App。",
        "图片文件名预留：assets/custom/store-management/reports-overview.png",
        "",
        "报表分析：Visitors",
        "这一页用于查看线上商店访客数、总访问次数、停留时间、每位访客访问次数、浏览页数与跳出率，并可按月份区间比较前后期表现。",
        "图片文件名预留：assets/custom/store-management/reports-visitors.png",
        "",
        "报表分析：Conversion",
        "这一页用于查看访客转化为顾客的比例，包含总转化率、新访客转化、回访者转化、重复订单转化，以及移动/桌面访客转化。",
        "图片文件名预留：assets/custom/store-management/reports-conversion.png",
        "",
        "报表分析：Orders",
        "这一页用于查看商店订单表现，例如订单数、每位顾客订单数、每笔订单商品数、售出商品数与商店营收。",
        "图片文件名预留：assets/custom/store-management/reports-orders.png",
        "",
        "报表分析：Revenue",
        "这一页用于查看商店营收、平均订单金额、每位顾客平均营收与每位访客平均营收，也可提示升级以取得更完整财务报表。",
        "图片文件名预留：assets/custom/store-management/reports-revenue.png",
        "",
        "报表分析：Marketing",
        "这一页用于查看销售来源与营销成效，协助了解营销活动如何影响商店业绩，也可提示升级以取得完整 Marketing reports。",
        "图片文件名预留：assets/custom/store-management/reports-marketing.png",
        "",
        "报表分析：Stats",
        "这一页是 Stats 统计总览，用于查看流量、营收、转化率、订单、购买行为、热门商品、热门分类等整体运营指标。",
        "图片文件名预留：assets/custom/store-management/reports-stats.png",
        "",
        "销售渠道：Sell Everywhere",
        "这一页属于 Sales Channels 总览。它集中列出可同步或推广商品的渠道，例如 iOS/Android 移动 App、Instagram Shopping、Facebook Shop、Facebook Messenger、Google Shopping、TikTok 与其他市场平台。",
        "图片文件名预留：assets/custom/store-management/sales-channels-overview.png",
        "",
        "销售渠道：Instagram",
        "这一页用于连接 Instagram Shopping，通过 Facebook Page 与 Instagram 账号串接，让商品可在 Instagram 上被标记与销售。",
        "图片文件名预留：assets/custom/store-management/sales-channel-instagram.png",
        "",
        "销售渠道：Facebook",
        "这一页用于连接 Facebook Shop，让商店商品同步到 Facebook，并可搭配 Facebook Ads 进行推广与再营销。",
        "图片文件名预留：assets/custom/store-management/sales-channel-facebook.png",
        "",
        "销售渠道：TikTok",
        "这一页用于连接 TikTok For Business。截图显示 Taiwan 目前不支持 TikTok Business Tools，因此暂时无法启用 TikTok 广告串接。",
        "图片文件名预留：assets/custom/store-management/sales-channel-tiktok.png",
        "",
        "销售渠道：Mobile App",
        "这一页用于下载或登录商店移动 App。用途是在手机上即时管理订单、商品、库存、折扣、弃单与顾客通知。",
        "图片文件名预留：assets/custom/store-management/sales-channel-mobile-app.png",
        "",
        "其他渠道：Facebook Messenger",
        "这一页用于启用 Facebook Messenger，让顾客可以从商品页直接发送消息联系商店，方便即时客服与回访沟通。",
        "图片文件名预留：assets/custom/store-management/other-channel-facebook-messenger.png",
        "",
        "其他渠道：Google Shopping",
        "这一页用于自动化 Google Shopping，并可生成 Google Shopping product feed，上传到 Google Merchant Center 或用于广告活动。",
        "图片文件名预留：assets/custom/store-management/other-channel-google-shopping.png",
        "",
        "其他渠道：eBay",
        "这一页是 eBay 销售渠道功能。画面显示需升级方案才能启用，可将商品刊登到 eBay，并从商店后台管理商品、订单与库存同步。",
        "图片文件名预留：assets/custom/store-management/other-channel-ebay.png",
        "",
        "其他渠道：Amazon",
        "这一页是 Amazon 销售渠道功能。画面显示需升级方案才能启用，可将商品刊登到 Amazon，并从商店后台管理商品与库存同步。",
        "图片文件名预留：assets/custom/store-management/other-channel-amazon.png",
      ],
      en: [
        "Store Management",
        "",
        "This guide explains the main ecommerce admin areas in the Oasis/Duda-based store backend.",
        "",
        "Scope: dashboard, products, orders, marketing, reports, payments, shipping, sales channels, and apps.",
      ],
    },
    gallery: [
      ["store-entry-welcome.png", "Store 初始畫面"],
      ["dashboard-overview.png", "商店總覽 Dashboard"],
      ["my-sales-orders.png", "銷售管理：Orders"],
      ["my-sales-abandoned-carts.png", "銷售管理：Abandoned Carts"],
      ["my-sales-customers.png", "銷售管理：Customers"],
      ["my-sales-subscriptions.png", "銷售管理：Subscriptions"],
      ["catalog-products.png", "商品目錄：Products"],
      ["catalog-categories.png", "商品目錄：Categories"],
      ["catalog-gift-cards.png", "商品目錄：Gift Cards"],
      ["catalog-data-import-export.png", "商品目錄：Data Import and Export"],
      ["marketing-overview-top.png", "行銷管理：Overview 上半部"],
      ["marketing-overview-convert-visitors.png", "行銷管理：轉換訪客"],
      ["marketing-overview-convert-customers.png", "行銷管理：折扣與棄單轉換"],
      ["marketing-overview-loyal-customers.png", "行銷管理：顧客忠誠與報表"],
      ["marketing-google-ads.png", "行銷管理：Google Ads"],
      ["marketing-retargeting.png", "行銷管理：Retargeting"],
      ["marketing-facebook-ads.png", "行銷管理：Facebook Ads"],
      ["marketing-discount-coupons.png", "行銷管理：Discount Coupons"],
      ["marketing-promotions.png", "行銷管理：Promotions"],
      ["marketing-newsletters.png", "行銷管理：Newsletters"],
      ["marketing-automated-emails.png", "行銷管理：Automated Emails"],
      ["reports-overview.png", "報表分析：Overview"],
      ["reports-overview-bottom.png", "報表分析：Overview 下半部"],
      ["reports-visitors.png", "報表分析：Visitors"],
      ["reports-conversion.png", "報表分析：Conversion"],
      ["reports-orders.png", "報表分析：Orders"],
      ["reports-revenue.png", "報表分析：Revenue"],
      ["reports-marketing.png", "報表分析：Marketing"],
      ["reports-stats.png", "報表分析：Stats"],
      ["sales-channels-overview.png", "銷售通路：Sell Everywhere"],
      ["sales-channels-overview-bottom.png", "銷售通路：Sell Everywhere 下半部"],
      ["sales-channel-instagram.png", "銷售通路：Instagram"],
      ["sales-channel-facebook.png", "銷售通路：Facebook"],
      ["sales-channel-tiktok.png", "銷售通路：TikTok"],
      ["sales-channel-mobile-app.png", "銷售通路：Mobile App"],
      ["other-channel-facebook-messenger.png", "其他通路：Facebook Messenger"],
      ["other-channel-google-shopping.png", "其他通路：Google Shopping"],
      ["other-channel-ebay.png", "其他通路：eBay"],
      ["other-channel-amazon.png", "其他通路：Amazon"],
      ["payment-overview.png", "付款設定：Payment"],
      ["payment-methods.png", "付款設定：Payment Methods"],
      ["shipping-pickup.png", "配送與取貨：Shipping and Pickup"],
      ["settings-general.png", "設定：General"],
      ["settings-taxes.png", "設定：Taxes"],
      ["settings-legal-compliance.png", "設定：Legal Compliance"],
      ["settings-notifications.png", "設定：Notifications"],
      ["settings-invoice.png", "設定：Printable Order / Invoice"],
      ["settings-customer-groups.png", "設定：Customer Groups"],
      ["settings-product-types.png", "設定：Product Types"],
      ["settings-product-filters.png", "設定：Product Filters"],
      ["settings-custom-checkout-fields.png", "設定：Custom Checkout Fields"],
      ["settings-whats-new.png", "設定：What's New"],
      ["app-market-overview.png", "App Market：Overview"],
      ["app-market-featured.png", "App Market：Featured Apps"],
      ["app-market-list-1.png", "App Market：App 清單 1"],
      ["app-market-list-2.png", "App Market：App 清單 2"],
      ["app-market-list-3.png", "App Market：App 清單 3"],
      ["app-market-list-4.png", "App Market：App 清單 4"],
      ["my-apps.png", "My Apps"],
      ["app-market-empty-state.png", "App Market：空狀態"],
    ],
    category: ["store_management"],
    shown_on: [],
    categoryLabels: {
      store_management: "電子商務",
    },
    localThumbnail: "",
    localVideo: "",
    remoteThumbnail: "",
    remoteVideo: "",
  },
];

const labels = {
  "zh-tw": {
    allCategories: "全部分類",
    visible: "已顯示",
    lessons: "個章節",
    shownOn: "適用對象",
    noDescription: "尚未提供說明。",
    loadError: "無法載入資料",
    categories: {
      getting_started: "入門",
      creating_sites: "建立網站",
      website_builder: "網站建構器",
      website_account_management: "網站帳戶管理",
      website_setup_and_management_guide: "網站設定與管理指南",
      webCenter_owner_onboarding: "WebCenter 擁有者入門",
      store_management: "電子商務",
      products: "產品",
    },
    audience: {
      partner: "合作夥伴",
      member: "會員",
    },
  },
  "zh-cn": {
    allCategories: "全部分类",
    visible: "已显示",
    lessons: "个章节",
    shownOn: "适用对象",
    noDescription: "尚未提供说明。",
    loadError: "无法加载数据",
    categories: {
      getting_started: "入门",
      creating_sites: "创建网站",
      website_builder: "网站构建器",
      website_account_management: "网站账户管理",
      website_setup_and_management_guide: "网站设置和管理指南",
      webCenter_owner_onboarding: "WebCenter 所有者入门",
      store_management: "电子商务",
      products: "产品",
    },
    audience: {
      partner: "合作伙伴",
      member: "会员",
    },
  },
  en: {
    allCategories: "All categories",
    visible: "visible",
    lessons: "lessons",
    shownOn: "Shown on",
    noDescription: "No description provided.",
    loadError: "Could not load data",
    categories: {},
    audience: {
      partner: "partner",
      member: "member",
    },
  },
  es: {
    allCategories: "Todas las categorías",
    visible: "visibles",
    lessons: "lecciones",
    shownOn: "Disponible para",
    noDescription: "No se proporcionó descripción.",
    loadError: "No se pudieron cargar los datos",
    categories: {},
    audience: {
      partner: "socio",
      member: "miembro",
    },
  },
  id: {
    allCategories: "Semua kategori",
    visible: "ditampilkan",
    lessons: "pelajaran",
    shownOn: "Ditampilkan untuk",
    noDescription: "Belum ada deskripsi.",
    loadError: "Data tidak dapat dimuat",
    categories: {},
    audience: {
      partner: "partner",
      member: "anggota",
    },
  },
};

function ui() {
  return labels[state.language] || labels["zh-tw"];
}

const els = {
  countLabel: document.querySelector("#countLabel"),
  searchInput: document.querySelector("#searchInput"),
  categoryNav: document.querySelector("#categoryNav"),
  lessonGrid: document.querySelector("#lessonGrid"),
  visibleCount: document.querySelector("#visibleCount"),
  title: document.querySelector("#lessonTitle"),
  description: document.querySelector("#lessonDescription"),
  video: document.querySelector("#lessonVideo"),
  textContent: document.querySelector("#textContent"),
  videoFrame: document.querySelector(".video-frame"),
  actions: document.querySelector(".actions"),
  openVideo: document.querySelector("#openVideo"),
  openSource: document.querySelector("#openSource"),
  audience: document.querySelector("#audienceLabel"),
  category: document.querySelector("#categoryLabel"),
};

function text(value, fallback = "") {
  if (!value) return fallback;
  return value[state.language] || value.en || fallback;
}

function categoryLabel(key) {
  const local = ui().categories[key];
  if (local) return local;
  const found = state.lessons.find((lesson) => lesson.categoryLabels?.[key]);
  return found?.categoryLabels?.[key] || key.replaceAll("_", " ");
}

function filteredLessons() {
  const query = state.query.trim().toLowerCase();
  return state.lessons.filter((lesson) => {
    const categoryMatch = state.category === "all" || lesson.category.includes(state.category);
    if (!categoryMatch) return false;
    const content = Array.isArray(lesson.content?.[state.language]) ? lesson.content[state.language].join(" ") : "";
    const haystack = [text(lesson.title), text(lesson.description), content, lesson.id].join(" ").toLowerCase();
    return !query || haystack.includes(query);
  });
}

function renderCategories() {
  const categories = [...new Set(state.lessons.flatMap((lesson) => lesson.category))];
  els.categoryNav.innerHTML = "";
  const all = document.createElement("button");
  all.textContent = ui().allCategories;
  all.className = state.category === "all" ? "active" : "";
  all.addEventListener("click", () => {
    state.category = "all";
    render();
  });
  els.categoryNav.append(all);

  for (const key of categories) {
    const button = document.createElement("button");
    button.textContent = categoryLabel(key);
    button.className = state.category === key ? "active" : "";
    button.addEventListener("click", () => {
      state.category = key;
      render();
    });
    els.categoryNav.append(button);
  }
}

function renderActiveLesson(lesson) {
  if (!lesson) return;
  state.activeId = lesson.id;
  const title = text(lesson.title, lesson.id);
  const description = text(lesson.description, ui().noDescription);
  const video = lesson.localVideo || lesson.remoteVideo;
  const isText = lesson.kind === "text";

  els.title.textContent = title;
  els.description.textContent = description;
  els.textContent.hidden = !isText;
  els.videoFrame.hidden = isText;
  els.actions.hidden = isText;

  if (isText) {
    els.video.removeAttribute("src");
    els.video.load();
    const content = lesson.content?.[state.language] || lesson.content?.["zh-tw"] || lesson.content?.en || [];
    els.textContent.innerHTML = renderTextContent(content, lesson.gallery);
  } else {
    els.textContent.innerHTML = "";
    els.video.poster = lesson.localThumbnail || lesson.remoteThumbnail || "";
    els.video.src = video;
    els.openVideo.href = video;
    els.openSource.href = lesson.remoteVideo || video;
  }
  const audience = lesson.shown_on || [];
  els.audience.textContent = audience.length
    ? `${ui().shownOn}: ${audience.map((key) => ui().audience[key] || key).join(", ")}`
    : "";
  els.category.textContent = lesson.category.map(categoryLabel).join(" / ");
}

function renderTextContent(lines, gallery = []) {
  const renderedPaths = new Set();
  const chunks = [];
  let tocItems = [];

  const flushToc = () => {
    if (tocItems.length === 0) return;
    chunks.push(`
      <ol class="toc-list">
        ${tocItems.map((line) => `<li>${escapeHtml(line.replace(/^\d+\.\s*/, ""))}</li>`).join("")}
      </ol>
    `);
    tocItems = [];
  };

  for (const line of lines) {
    const imagePath = line.match(/^圖片(?:檔名|文件名)預留：(.+)$/)?.[1];
    if (imagePath) {
      flushToc();
      renderedPaths.add(imagePath);
      chunks.push(renderGuideImage(imagePath, ""));
      continue;
    }

    if (/^\d+\./.test(line)) {
      tocItems.push(line);
      continue;
    }

    flushToc();

    if (line.trim() === "") {
      chunks.push(`<div class="text-gap"></div>`);
    } else if (!line.includes("。") && line.length <= 32) {
      chunks.push(`<h3>${escapeHtml(line)}</h3>`);
    } else {
      chunks.push(`<p>${escapeHtml(line)}</p>`);
    }
  }

  flushToc();

  const body = chunks.join("");

  const remainingGallery = gallery
    .map(([fileName, caption]) => [`assets/custom/store-management/${fileName}`, caption])
    .filter(([path]) => !renderedPaths.has(path));

  if (remainingGallery.length === 0) return body;

  return `${body}
    <h3>功能畫面導覽</h3>
    <p>以下畫面依照商店後台的主要功能整理，可搭配上方說明快速對照各功能位置。</p>
    ${remainingGallery.map(([path, caption]) => renderGuideImage(path, caption)).join("")}
  `;
}

function renderGuideImage(imagePath, caption) {
  const captionMarkup = caption
    ? `<figcaption><strong>${escapeHtml(caption)}</strong></figcaption>`
    : "";
  return `
    <figure class="guide-image">
      <img src="${imagePath}" alt="${escapeHtml(caption || "功能畫面")}" loading="lazy" onerror="this.closest('figure').remove()" />
      ${captionMarkup}
    </figure>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderCards(lessons) {
  els.lessonGrid.innerHTML = "";
  for (const lesson of lessons) {
    const card = document.createElement("button");
    card.className = `card${lesson.id === state.activeId ? " active" : ""}`;
    card.type = "button";
    const thumb = lesson.localThumbnail || lesson.remoteThumbnail || "";
    card.innerHTML = `
      ${
        thumb
          ? `<img class="thumb" alt="" src="${thumb}">`
          : `<span class="thumb text-thumb">TEXT</span>`
      }
      <span class="card-body">
        <span class="tag">${lesson.category.map(categoryLabel).join(" / ")}</span>
        <h3>${text(lesson.title, lesson.id)}</h3>
        <p>${text(lesson.description, ui().noDescription)}</p>
      </span>
    `;
    card.addEventListener("click", () => {
      renderActiveLesson(lesson);
      renderCards(filteredLessons());
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    els.lessonGrid.append(card);
  }
}

function render() {
  renderCategories();
  const lessons = filteredLessons();
  els.visibleCount.textContent = `${ui().visible} ${lessons.length} ${ui().lessons}`;
  if (!lessons.some((lesson) => lesson.id === state.activeId)) {
    renderActiveLesson(lessons[0] || state.lessons[0]);
  }
  renderCards(lessons);
}

async function init() {
  const sourceLessons = window.GUIDE_DATA || (await fetch("data/guide.json").then((response) => response.json()));
  state.lessons = [...customLessons, ...sourceLessons];
  state.activeId = state.lessons[0]?.id || "";
  els.countLabel.textContent = `Oasis/Duda-based · 共 ${state.lessons.length} 個章節`;

  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });
  render();
}

init().catch((error) => {
  els.countLabel.textContent = ui().loadError;
  console.error(error);
});
