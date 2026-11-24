// Published reels from the daily AI engineering lesson series, newest first.
// Updated after every post: add the new reel at the top with its direct /reel/ link.
export type Lesson = {
  day: number | null; // topic-bank day; null for reels outside the 100-day series
  title: string;
  date: string; // YYYY-MM-DD, Philippine time
  url: string; // direct link to the reel
  resource?: string; // the free repo the lesson recommends
};

export const reelsTab = "https://www.facebook.com/profile.php?id=61596426017464&sk=reels_tab";

export const lessons: Lesson[] = [
  {
    day: 1,
    title: "Where does a RAG pipeline break?",
    date: "2026-11-23",
    url: "https://www.facebook.com/reel/2006955749983242",
    resource: "https://github.com/anthropics/claude-cookbooks",
  },
  {
    day: null,
    title: "5 checks before AI answers your customers",
    date: "2026-11-23",
    url: "https://www.facebook.com/reel/1469974655090544",
  },
  {
    day: null,
    title: "A mech peregrine, built in code",
    date: "2026-11-22",
    url: "https://www.facebook.com/reel/4558023927846820",
  },
];
