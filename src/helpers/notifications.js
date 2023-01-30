import { notification } from "antd";

export const openNotification = ({ message, description, type }) => {
  switch (type) {
    case "success":
      notification.success({
        placement: "bottomRight",
        message,
        description,
        className: "notification success"
      });
      break;
    case "error":
      notification.error({
        placement: "bottomRight",
        message,
        description,
        className: "notification error"
      });
      break;
    case "warn":
      notification.warn({
        placement: "bottomRight",
        message,
        description,
        className: "notification warning"
      });
      break;
    default:
      notification.open({
        placement: "bottomRight",
        message,
        description,
        className: "notification"
      });
      break;
  }
};

export const extractErrorMessage = (e) => {

  if(e?.code) {
    if(Number.isInteger(e.code)) {
      // already parsed (e.g. MetaMask's "user rejected tx"), return the original message
      return e.message
    }
  }

  // see if we can regex the error buried inside the message & stack
  const eStr = e.toString()
  const matches = eStr.match(/\(error=(.*?), method=/);

  if(matches) {
    try {
      const errObj = JSON.parse(matches[1])
      // if it's a contract revert, transform it into a more readable error message
      switch(errObj.message) {
        case "execution reverted: eth too low":
          return "Purchase price too low. Try a higher price"
        case "execution reverted: not started":
          return "Sale has not started yet"
        case "execution reverted: sold out":
          return "Sold out!"
        case "execution reverted: ended":
          return "Sale has ended"
        case "execution reverted: > max per tx":
          return "Cannot mint more than maximum"
        case "execution reverted: > mint limit":
          return "Sorry! You have reached the Blind mint limit for this wallet"
        case "execution reverted: exceeds supply":
          return "Cannot mint more than supply!"
        case "execution reverted: not revealed":
          return "Hands have not been revealed yet"
        case "execution reverted: not distributed":
          return "Hands have not been distributed yet"
        case "execution reverted: invalid id":
          return "Invalid Token ID"
        default:
          // otherwise, just return the parsed message
          return errObj.message.replace("execution reverted: ", "")
      }
    } catch(pErr) {
      // couldn't turn into JSON. Just return original message
      console.log(pErr)
      return e.message
    }
  } else {
    // just return the original message
    return e.message
  }
}
