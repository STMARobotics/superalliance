import React, { createContext, useContext } from 'react';

const EpicCoolContext = createContext(null);
function useEpicCool() {
  const ctx = useContext(EpicCoolContext);
  if (!ctx) {
    throw new Error("useEpicCool hook was called outside of context, make sure your app is wrapped with ColorSchemeProvider component");
  }
  return ctx;
}
function EpicCoolProvider({
  enabled,
  toggleEnabled,
  children
}) {
  return /* @__PURE__ */ React.createElement(EpicCoolContext.Provider, {
    value: { enabled, toggleEnabled }
  }, children);
}
EpicCoolContext.displayName = "@superalliance/core/EpicCoolProvider";

export { EpicCoolProvider, useEpicCool };
//# sourceMappingURL=ColorSchemeProvider.js.map
