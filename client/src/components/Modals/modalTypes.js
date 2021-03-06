import SellCdpModal from './SellCdpModal/SellCdpModal';
import CloseCdpModal from './CloseCdpModal/CloseCdpModal';
import TransferCdpModal from './TransferCdpModal/TransferCdpModal';
import CancelCloseCdpModal from './CancelSellCdpModal/CancelSellCdpModal';
import RepayModal from './RepayModal/RepayModal';
import BoostModal from './BoostModal/BoostModal';
import PaybackCdpModal from './PaybackCdpModal/PaybackCdpModal';
import ContactUsModal from './ContactUsModal/ContactUsModal';

// Register modal types here
export const SELL_CDP_MODAL = 'SELL_CDP_MODAL';
export const CLOSE_CDP_MODAL = 'CLOSE_CDP_MODAL';
export const TRANSFER_CDP_MODAL = 'TRANSFER_CDP_MODAL';
export const CANCEL_SELL_CDP_MODAL = 'CANCEL_SELL_CDP_MODAL';
export const REPAY_MODAL = 'REPAY_MODAL';
export const BOOST_MODAL = 'BOOST_MODAL';
export const PAYBACK_CDP_MODAL = 'PAYBACK_CDP_MODAL';
export const CONTACT_US_MODAL = 'CONTACT_US_MODAL';

export default {
  [SELL_CDP_MODAL]: SellCdpModal,
  [CLOSE_CDP_MODAL]: CloseCdpModal,
  [TRANSFER_CDP_MODAL]: TransferCdpModal,
  [CANCEL_SELL_CDP_MODAL]: CancelCloseCdpModal,
  [REPAY_MODAL]: RepayModal,
  [BOOST_MODAL]: BoostModal,
  [PAYBACK_CDP_MODAL]: PaybackCdpModal,
  [CONTACT_US_MODAL]: ContactUsModal,
};
