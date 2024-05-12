import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  // cancel http request if user leaves the page before request has been completed
  // useRef creates a piece of data that will not be reinitialized or changed after
  // sendRequest runs again
  const activeHttpRequests = useRef([]);

  // useCallback makes sure there are no duplicate calls to this function
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      // setIsLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        // Clear the abort controllers taht belong to request that just completed
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );
        if (!response.ok) {
          // TODO: change this to redirect to an error page
          throw new Error(responseData.error);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.error);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  //clean up logic when a component unmounts
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
