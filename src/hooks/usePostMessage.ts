import { useEffect, useReducer } from "react";

export function usePostMessage() {
  const [state, dispatch] = useReducer(
    (s, e) => {
      if (e.type === "stepUpdate")
        return { ...s, step: e.step, logs: [...s.logs, e] };
      if (e.type === "processCompleted")
        return { ...s, status: e.status, logs: [...s.logs, e] };
      if (e.type === "clearLogs")
        return { ...s, logs: [], step: undefined, status: undefined };
      return s;
    },
    { logs: [] }
  );

  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      if (!ev.data?.type) return;
      dispatch(ev.data);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const clearLogs = () => {
    dispatch({ type: "clearLogs" });
  };

  return { ...state, clearLogs };
}
