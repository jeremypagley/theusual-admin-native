const centsToUSD = (cents) => {
  let dollars = cents / 100;
  return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
}

export default {
  centsToUSD,
}