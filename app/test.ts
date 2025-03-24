import { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/media/file/presentazione_VRtualize.pdf");
      const data = await response.json();
      console.log(data);
    };

    fetchData();
  }, []);

  return null;
};

export default Test;
