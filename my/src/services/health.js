function getHealthStatus() {
  return {
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
export {
  getHealthStatus
};
