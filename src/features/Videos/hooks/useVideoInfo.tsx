interface ReturnType {
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
  likeCount: number;
  liked: boolean;
  shareCount: number;
  bookmarkCount: number;
  bookmarked: boolean;
  videoUrl: string;
  videoDescription: string;
  videoName: string;
  videoDuration: number;
}

export const useVideoInfo = (videoId: string): ReturnType => {
  // TODO: Remove and populate from store instead.
  return {
    creatorId: "1",
    creatorUsername: "addyraelopez",
    creatorName: "Addison Rae",
    creatorAvatarUrl: null,
    likeCount: 8000,
    liked: false,
    shareCount: 540,
    bookmarkCount: 123,
    videoUrl: "https://addisonrae.com",
    videoDescription:
      "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove." +
      videoId,
    videoName: "",
    videoDuration: 12,
    bookmarked: false,
  };
};
