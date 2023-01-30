export const svgToImgSrc = (svg) => {
  const buff = new Buffer(svg);
  const base64data = buff.toString('base64');
  return `data:image/svg+xml;base64,${base64data}`;
};

export const decodeNftUriToText = (nft) => {
  const nftBase64 = nft.replace("data:application/json;base64,", "");
  const buff = new Buffer(nftBase64, "base64");
  return buff.toString("ascii");
};

export const decodeNftUriToJson = (nft) => {
  const text = decodeNftUriToText(nft);
  return JSON.parse(text);
};