import { useState, useEffect } from "react";
import axios from "axios";
import { DELETE, PUT } from "../constants/constants";

function APICall(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios({
          method: props.method,
          url: props.url,
          params: props.params,
          data: props.data,
          headers: props.headers,
        });
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [props.method, props.url, props.params, props.data, props.headers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data && props.method !== PUT && props.method !== DELETE) return null;

  return props.render(data);
}

export default APICall;
