import { useState, useRef, useEffect } from "react";

//@ts-ignore
export default function useStateWithCallback(initialState) {
  const [state, setState] = useState(initialState);

  const callbackRef = useRef(null);

  //@ts-ignore
  const setStateCallback = (state, callback) => {
    callbackRef.current = callback; // store passed callback to ref
    setState(state);
  };

  useEffect(() => {
    if (callbackRef.current) {
      //@ts-ignore
      callbackRef.current(state);
      callbackRef.current = null; // reset callback
    }
  }, [state]);

  return [state, setStateCallback];
}
