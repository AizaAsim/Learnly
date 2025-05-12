import { useEffect, useState } from "react";
import { getTokens } from "../services/callable";
import { VideoTokens } from "../types";

const useVideoTokens = (videoId: string | undefined) => {
  const [tokens, setTokens] = useState<VideoTokens | null>(null);

  useEffect(() => {
    if (!videoId) return;
    getTokens({ videoId }).then(({ data }) => {
      setTokens({ ...data });
    });
  }, [videoId]);

  return tokens;
};

export default useVideoTokens;
