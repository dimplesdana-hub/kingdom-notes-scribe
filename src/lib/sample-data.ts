export type SessionType = "Meeting" | "Assembly" | "Convention" | "Personal Study" | "Field Service";

export interface Transcript {
  id: string;
  type: SessionType;
  title: string;
  speaker: string;
  congregation: string;
  date: string;
  duration: string;
  preview: string;
  scriptures: string[];
  body: TranscriptParagraph[];
  summary: string[];
  actionItems: string[];
}

export interface TranscriptParagraph {
  time: string;
  speaker: string;
  text: string;
}

export const sampleTranscripts: Transcript[] = [
  {
    id: "t1",
    type: "Meeting",
    title: "Why We Can Trust Jehovah's Promises",
    speaker: "Bro. Marcus Williams",
    congregation: "Eastside Congregation",
    date: "May 25, 2026",
    duration: "32 min",
    preview:
      "As we read at Romans 8:38, 39, nothing can separate us from God's love. The speaker then referenced the Watchtower study article...",
    scriptures: ["Romans 8:38", "Psalm 46:1", "Isaiah 41:10"],
    body: [
      {
        time: "00:00",
        speaker: "Bro. Marcus Williams",
        text: "Good morning, brothers and sisters. Today we want to consider why we can have complete trust in Jehovah's promises. As we read at [Romans 8:38], nothing — neither death nor life — can separate us from God's love.",
      },
      {
        time: "04:12",
        speaker: "Bro. Marcus Williams",
        text: "First, consider the historical evidence. Second, consider the personal evidence. Third, consider the scriptural evidence. The Watchtower article we studied last week brought out a beautiful point. Notice how [Psalm 46:1] reassures us: 'God is for us a refuge and strength, a help that is readily found in times of distress.'",
      },
      {
        time: "12:48",
        speaker: "Bro. Johnson",
        text: "Brother Johnson beautifully explained from [Isaiah 41:10] that we have no reason to fear, for Jehovah is with us.",
      },
    ],
    summary: [
      "Jehovah's promises are trustworthy because of His unchanging love (Romans 8:38).",
      "Three reasons given: historical, personal, and scriptural evidence.",
      "Believers can rely on Jehovah as a refuge in distress (Psalm 46:1).",
      "Fear is replaced by confidence when we trust in Jehovah (Isaiah 41:10).",
    ],
    actionItems: [
      "Read the next Watchtower study article before next meeting.",
      "Share Romans 8:38 with someone struggling this week.",
      "Reflect personally on a time Jehovah proved trustworthy.",
    ],
  },
  {
    id: "t2",
    type: "Convention",
    title: "Pursue Peace!",
    speaker: "Bro. David Chen",
    congregation: "Riverside Congregation",
    date: "May 18, 2026",
    duration: "45 min",
    preview:
      "The 2026 regional convention opened with a stirring keynote on pursuing peace in a divided world...",
    scriptures: ["Matthew 5:9", "Philippians 4:7", "Romans 12:18"],
    body: [
      {
        time: "00:00",
        speaker: "Bro. David Chen",
        text: "Welcome to our 2026 regional convention with the theme 'Pursue Peace!' Jesus said at [Matthew 5:9], 'Happy are the peacemakers.'",
      },
      {
        time: "08:30",
        speaker: "Bro. David Chen",
        text: "Notice the peace described at [Philippians 4:7] — it surpasses all understanding. And [Romans 12:18] urges us: as far as it depends on us, be peaceable with all men.",
      },
    ],
    summary: [
      "The convention theme calls us to actively pursue peace.",
      "True peace comes from God and surpasses human understanding.",
      "Peace begins with our own conduct toward others.",
    ],
    actionItems: [
      "Identify one relationship to actively pursue peace in this week.",
      "Memorize Matthew 5:9.",
    ],
  },
  {
    id: "t3",
    type: "Personal Study",
    title: "Deep Study of Daniel Chapter 2",
    speaker: "Self",
    congregation: "",
    date: "May 14, 2026",
    duration: "1h 12 min",
    preview: "Personal study notes covering the image dream and its meaning today...",
    scriptures: ["Daniel 2:44"],
    body: [
      {
        time: "00:00",
        speaker: "Self",
        text: "Today I'm studying the prophecy at [Daniel 2:44] — the Kingdom that will crush all others.",
      },
    ],
    summary: [
      "Daniel 2 outlines successive world powers ending in God's Kingdom.",
      "The Kingdom of God will permanently replace human rule.",
    ],
    actionItems: ["Review Insight on the Scriptures entry on Daniel 2."],
  },
];

export interface ProgramItem {
  id: string;
  time: string;
  title: string;
  type: string;
  person?: string;
}

export const weekendProgram = {
  date: "Sunday, June 7, 2026 — 10:00 AM",
  publicTalk: {
    title: "Courage to Stand Firm in a Divided World",
    speaker: "Bro. David Chen",
    congregation: "Riverside Congregation",
  },
  watchtowerStudy: {
    title: "Are You Ready for Jehovah's Day?",
    paragraphs: "Paragraphs 1–10",
    conductor: "Bro. Anthony Ruiz",
  },
  chairman: "Bro. Samuel Park",
};

export const midweekProgram = {
  date: "Thursday, June 4, 2026 — 7:30 PM",
  chairman: "Bro. Luis Romero",
  parts: [
    { id: "m1", time: "7:30", title: "Opening Comments", type: "Chairman", person: "Bro. Luis Romero" },
    { id: "m2", time: "7:33", title: "Treasures From God's Word — Proverbs 4", type: "Talk", person: "Bro. Mark Owens" },
    { id: "m3", time: "7:43", title: "Spiritual Gems", type: "Q&A", person: "Bro. Luis Romero" },
    { id: "m4", time: "7:53", title: "Bible Reading — Proverbs 4:1-19", type: "Reading", person: "Bro. Jordan Lee" },
    { id: "m5", time: "8:00", title: "Starting a Conversation", type: "Demonstration", person: "Sis. Maria Lopez" },
    { id: "m6", time: "8:05", title: "Following Up", type: "Demonstration", person: "Bro. Caleb Hart" },
    { id: "m7", time: "8:25", title: "Living as Christians — Be Patient With One Another", type: "Talk", person: "Bro. Daniel King" },
    { id: "m8", time: "8:40", title: "Congregation Bible Study", type: "Study", person: "Bro. Aaron Wells" },
  ],
};

export const conventionProgram = [
  { day: "Friday", date: "July 10, 2026", sessions: [
    { time: "9:20", title: "Music", type: "Music" },
    { time: "9:30", title: "Pursue Peace With All People!", type: "Keynote", person: "Bro. Anthony Morris" },
    { time: "10:00", title: "Peace From God Through Christ", type: "Symposium" },
    { time: "13:35", title: "Drama: Stand Firm in Faith", type: "Drama" },
  ]},
  { day: "Saturday", date: "July 11, 2026", sessions: [
    { time: "9:30", title: "Imitate the Prince of Peace", type: "Talk" },
    { time: "11:15", title: "Baptism Talk", type: "Talk" },
    { time: "14:00", title: "Bible-Based Drama", type: "Drama" },
  ]},
  { day: "Sunday", date: "July 12, 2026", sessions: [
    { time: "9:30", title: "Public Talk: Find Lasting Peace", type: "Public Talk" },
    { time: "11:00", title: "Watchtower Study", type: "Study" },
    { time: "13:30", title: "Concluding Discourse", type: "Final Talk" },
  ]},
];

export const updates = {
  broadcast: {
    title: "June 2026 Monthly Broadcast",
    description: "Encouragement and updates from the Governing Body for June 2026.",
    updated: "2 hours ago",
  },
  watchtower: {
    title: "The Watchtower — June 2026 Study Edition",
    date: "June 2026",
    updated: "1 day ago",
  },
  awake: {
    title: "Awake! No. 2 2026 — Finding Real Peace",
    date: "2026 No. 2",
    updated: "3 days ago",
  },
};
