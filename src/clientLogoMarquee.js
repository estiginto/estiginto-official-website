const LANE_COUNT = 3;
const RESERVED_SLOT_COUNT = 24;

const clientLogoDefinitions = [
  {
    tier: 1,
    clients: [
      ["marketech", "Marketech International Corp."],
      ["ezoom", "eZoom Information, Inc."],
      ["tradevan", "Trade-Van Information"],
      ["ey", "EY 安永"],
      ["lotus", "Lotus 美時化學製藥"],
      ["spg", "SPG 冠亞資產管理顧問"],
      ["commonwealth", "天下雜誌 CommonWealth Magazine"],
      ["morinaga", "森永 Morinaga"],
      ["jung-kwan-jang", "正官庄 Jung Kwan Jang"],
      ["yang-ming", "陽明海運 Yang Ming Marine Transport"],
      ["you-ming-huei", "台詮科技 You Ming Huei Co., LTD"],
      ["taiwan-mainstream-coop", "台灣主婦聯盟生活消費合作社"],
      ["kyl-auction", "高雄永樂拍賣 KYL Auction"],
    ],
  },
  {
    tier: 2,
    clients: [
      ["bureau-foreign-trade", "經濟部國際貿易局"],
      ["trade-negotiations", "行政院經貿談判辦公室"],
      ["taipei-architects", "臺北市建築師公會"],
      ["taiwan-stock-exchange", "臺灣證券交易所 Taiwan Stock Exchange"],
    ],
  },
  {
    tier: 3,
    clients: [
      ["eighteen-tea", "御用高級單本茶 十八味"],
      ["evco-creative-home", "EVCO Creative Home 美國生活用品百貨"],
      ["merica", "Merica"],
      ["after-school-nest", "放學窩"],
      ["kyce", "國裕建設 KYCE"],
      ["conflux", "Conflux 樂浪遊艇俱樂部"],
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
      ["bcfbw", "BCFBW"],
      ["vantage", "Vantage"],
      ["worthbee", "滿誠蜂蜜 Worthbee"],
      ["fvs", "FVS 黃金數位憑證"],
      ["juoda", "卓達室內裝修 Juoda Interior Design"],
      ["yun-counseling", "蘊光心理諮商所 Yun Counseling"],
      ["zhencheng-family-office", "臻承國際家族辦公室聯盟"],
      ["shanheyu", "善和寓"],
      ["apex-royal", "Apex Royal"],
      ["noah-builders", "NoahBuilders"],
      ["zentia", "Zentia RevoCart"],
      ["yabung", "Yabung 亞楓好物"],
    ],
  },
];

export const clientLogos = clientLogoDefinitions.flatMap(({ tier, clients }) => (
  clients.map(([id, alt]) => ({
    id,
    alt,
    tier,
    src: `/img/client-logos/${id}.webp`,
  }))
));

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
  const usesExplicitTiers = validClients.length > 0 && validClients.every((client) => (
    Number.isInteger(client.tier) && client.tier >= 1 && client.tier <= LANE_COUNT
  ));

  if (usesExplicitTiers) {
    return Array.from({ length: LANE_COUNT }, (_, laneIndex) => (
      validClients.filter((client) => client.tier === laneIndex + 1)
    ));
  }

  const itemCount = Math.max(RESERVED_SLOT_COUNT, validClients.length);
  const items = Array.from({ length: itemCount }, (_, index) => (
    validClients[index] || createReservedSlot(index)
  ));

  return Array.from({ length: LANE_COUNT }, (_, laneIndex) => (
    items.filter((_, itemIndex) => itemIndex % LANE_COUNT === laneIndex)
  ));
}
