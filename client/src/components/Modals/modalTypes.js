import SellCdpModal from './SellCdpModal/SellCdpModal';
import CloseCdpModal from './CloseCdpModal/CloseCdpModal';

// Register modal types here
export const SELL_CDP_MODAL = 'SELL_CDP_MODAL';
export const CLOSE_CDP_MODAL = 'CLOSE_CDP_MODAL';

export default {
  [SELL_CDP_MODAL]: SellCdpModal,
  [CLOSE_CDP_MODAL]: CloseCdpModal,
};
