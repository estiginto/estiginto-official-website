const LANE_COUNT = 3;
const RESERVED_SLOT_COUNT = 24;

const clientLogoDefinitions = [
  ["marketech", "Marketech International Corp."],
  ["ezoom", "eZoom Information, Inc."],
  ["tradevan", "Trade-Van Information"],
  ["ey", "EY 安永"],
  ["lotus", "Lotus 美時化學製藥"],
  ["spg", "SPG 冠亞資產管理顧問"],
  ["taiwan-mainstream-coop", "台灣主婦聯盟生活消費合作社"],
  ["kyl-auction", "高雄永樂拍賣 KYL Auction"],
  ["eighteen-tea", "御用高級單本茶 十八味"],
  ["evco-creative-home", "EVCO Creative Home 美國生活用品百貨"],
  ["merica", "Merica"],
  ["after-school-nest", "放學窩"],
  ["commonwealth", "天下雜誌 CommonWealth Magazine"],
  ["bureau-foreign-trade", "經濟部國際貿易局"],
  ["trade-negotiations", "行政院經貿談判辦公室"],
  ["taiwan-stock-exchange", "臺灣證券交易所 Taiwan Stock Exchange"],
  ["taipei-architects", "臺北市建築師公會"],
  ["morinaga", "森永 Morinaga"],
  ["jung-kwan-jang", "正官庄 Jung Kwan Jang"],
  ["kyce", "國裕建設 KYCE"],
  ["conflux", "Conflux 樂浪遊艇俱樂部"],
  ["fable", "fable"],
  ["tainan-airport", "臺南航空站 Tainan Airport"],
  ["archi-5", "ARCHI-5"],
  ["mca-creative-industries", "MCA Creative Industries 韓國文創"],
  ["taiwan-psychoanalytic", "臺灣精神分析學會"],
  ["wealthylife", "中華財富人生財商推廣協會 WealthyLife"],
  ["beyond-amazing", "Beyond Amazing 國際高端旅遊"],
  ["sleekstrip", "SleekStrip"],
  ["king-life", "King Life 徠福文具"],
  ["jing-he-medical", "景賀醫美"],
  ["a-plus-dermatology", "A+ Beauty 極緻皮膚專科診所"],
  ["bauer-group", "BauerGroup SmartVending"],
  ["lecoln-keysight", "立肯科技 Lecoln Technology / Keysight Technologies"],
  ["mj-color", "MJ. Color"],
  ["rotary", "Rotary International"],
  ["bcfbw", "BCFBW"],
  ["lions", "Lions International"],
  ["vantage", "Vantage"],
  ["wilderness", "荒野實境 Wilderness"],
  ["worthbee", "滿誠蜂蜜 Worthbee"],
  ["gb-biotech", "果寶生技 GB Biotech"],
  ["fvs", "FVS 黃金數位憑證"],
];

export const clientLogos = clientLogoDefinitions.map(([id, alt]) => ({
  id,
  alt,
  src: `/img/client-logos/${id}.webp`,
}));

function createReservedSlot(index) {
  return {
    id: `reserved-client-${String(index + 1).padStart(2, "0")}`,
    src: null,
    alt: "",
  };
}

export function buildClientLogoLanes(clients = []) {
  const validClients = clients.filter((client) => (
    typeof client?.id === "string"
    && typeof client?.src === "string"
    && typeof client?.alt === "string"
  ));
  const itemCount = Math.max(RESERVED_SLOT_COUNT, validClients.length);
  const items = Array.from({ length: itemCount }, (_, index) => (
    validClients[index] || createReservedSlot(index)
  ));

  return Array.from({ length: LANE_COUNT }, (_, laneIndex) => (
    items.filter((_, itemIndex) => itemIndex % LANE_COUNT === laneIndex)
  ));
}
