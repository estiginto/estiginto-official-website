const LANE_COUNT = 3;
const RESERVED_SLOT_COUNT = 24;

export const clientLogos = [];

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
