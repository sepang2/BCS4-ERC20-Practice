const OptionCard = ({ walletAccount, owner }) => {
  return <option value={walletAccount}>{owner}</option>;
};

export default OptionCard;
