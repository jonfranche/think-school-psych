import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();

  // cancel http request if user leaves the page before request has been completed
  // useRef creates a piece of data that will not be reinitialized or changed after
  // sendRequest runs again
  const activeHttpRequests = useRef<AbortController[]>([]);

  // useCallback makes sure there are no duplicate calls to this function
  const sendRequest = useCallback(
    async (
      url: string,
      method = "GET",
      body: string | null = null,
      headers?: {}
    ) => {
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

        const contentType = response.headers.get("Content-Type");

        let responseData;

        if (method === "GET" && contentType !== "application/json") {
          responseData = await response.blob();
        } else {
          responseData = await response.json();
        }

        // Clear the abort controllers taht belong to request that just completed
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );
        if (!response.ok) {
          navigator("/error", {
            state: { message: responseData.error, code: response.status },
          });
          return;
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        throw err;
      }
    },
    [navigator]
  );

  //clean up logic when a component unmounts
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl: AbortController) =>
        abortCtrl.abort()
      );
    };
  }, []);

  return { isLoading, sendRequest };
};
