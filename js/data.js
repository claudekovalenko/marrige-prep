// Seed content for the app. This is the "what I'm preparing" — the user's own
// progress lives in store.js and is keyed by the ids below, so ids must be stable.

export const PILLARS = [
  {
    id: 'church',
    title: 'A Church to Bring Her Into',
    short: 'Church',
    aim: 'Be rooted in one established local church — known by name, under real elders, serving — so that there is a home to invite her into, not just a Sunday I attend.',
    verse: 'And they devoted themselves to the apostles’ teaching and the fellowship, to the breaking of bread and the prayers.',
    ref: 'Acts 2:42',
    icon: 'church',
    steps: [
      { id: 'list', title: 'List every solid church within a 30-minute drive', hint: 'Doctrine, elders, and people actually doing life together — write down 5.' },
      { id: 'visit', title: 'Visit four of them, twice each', hint: 'A second visit tells you far more than the first.' },
      { id: 'settle', title: 'Pick one and attend eight Sundays straight', hint: 'Stop shopping. Commitment reveals what visiting never will.' },
      { id: 'pastor', title: 'Meet a pastor or elder face to face', hint: 'Tell him where you are and what you are preparing for.' },
      { id: 'group', title: 'Join a small group or midweek gathering', hint: 'This is where a church stops being a building.' },
      { id: 'serve', title: 'Serve on a team for a full season', hint: 'Setup, kids, sound, hospitality — anything that costs you something.' },
      { id: 'member', title: 'Become a member / covenant with the body', hint: 'Put yourself under authority before you ask her to.' },
      { id: 'known', title: 'Be genuinely known by five people there', hint: 'People who would notice if you went missing for two weeks.' },
      { id: 'couple', title: 'Ask an older married couple to know you', hint: 'Not formal mentorship yet — dinner, questions, honesty.' },
      { id: 'invite', title: 'Be able to say: "this is my church" and mean it', hint: 'The point of all of the above.' }
    ]
  },
  {
    id: 'provision',
    title: 'Enough to Carry a Household',
    short: 'Provision',
    aim: 'Build income, margin, and habits strong enough that she could stay home with our children without fear — and so that money is never the reason we wait.',
    verse: 'But if anyone does not provide for his relatives, and especially for members of his household, he has denied the faith.',
    ref: '1 Timothy 5:8',
    icon: 'coin',
    steps: [
      { id: 'number', title: 'Calculate the real number', hint: 'Housing, food, insurance, giving, kids, margin — what one income must actually cover.' },
      { id: 'budget', title: 'Keep a written budget for three months straight', hint: 'Every dollar named before the month begins.' },
      { id: 'debt', title: 'Clear all consumer debt', hint: 'Cards, car, anything that follows you into a marriage.' },
      { id: 'emergency', title: 'Save a 6-month emergency fund', hint: 'Six months of the real number above, untouched.' },
      { id: 'income', title: 'Grow income toward carrying the household alone', hint: 'Raise, skill, side work, or a move — write the plan and work it.' },
      { id: 'give', title: 'Give consistently and first', hint: 'Generosity proves money is a tool, not a master.' },
      { id: 'invest', title: 'Automate retirement and long-term investing', hint: 'Boring, monthly, untouched.' },
      { id: 'insure', title: 'Get term life, health, and disability cover', hint: 'Loving someone means planning past your own life.' },
      { id: 'house', title: 'Decide the housing plan — rent or buy, where', hint: 'Near the church, near family, or where the work is.' },
      { id: 'mentor', title: 'Have a financially mature man review your numbers', hint: 'Let someone who has done it look at the spreadsheet.' },
      { id: 'ring', title: 'Set aside the wedding and ring fund', hint: 'Paid in cash. No marriage should begin in debt.' }
    ]
  },
  {
    id: 'body',
    title: 'Strength Worth Trusting',
    short: 'Strength',
    aim: 'Train the body God gave me — for her attraction, for the work of providing, for the endurance fatherhood asks, and because it is His temple.',
    verse: 'Do you not know that your body is a temple of the Holy Spirit within you? So glorify God in your body.',
    ref: '1 Corinthians 6:19–20',
    icon: 'flame',
    steps: [
      { id: 'baseline', title: 'Record the baseline', hint: 'Weight, waist, main lifts, a photo. You cannot steward what you do not measure.' },
      { id: 'program', title: 'Pick one program and run it 12 weeks', hint: 'Program-hopping is how men train for years with nothing to show.' },
      { id: 'lift', title: 'Lift four times a week for a full quarter', hint: 'Consistency beats intensity every single time.' },
      { id: 'strength', title: 'Hit the strength marks', hint: 'Bodyweight bench, 1.5x squat, 2x deadlift, 10 clean pull-ups.' },
      { id: 'condition', title: 'Build conditioning you would not be ashamed of', hint: 'Run, ruck, or row — be able to carry a child up a hill.' },
      { id: 'food', title: 'Eat on purpose — protein, whole food, less sugar', hint: 'Set a daily protein number and hit it.' },
      { id: 'sleep', title: 'Protect 7–8 hours of sleep', hint: 'Discipline at night is what makes discipline at dawn possible.' },
      { id: 'cut', title: 'Cut what dulls you', hint: 'The scroll, the drink, the late nights that steal the morning.' },
      { id: 'physical', title: 'Get an annual physical and bloodwork', hint: 'Know your numbers before someone depends on them.' },
      { id: 'grooming', title: 'Dress and carry yourself like a man being sent', hint: 'Not vanity. Care — for her sake as much as yours.' }
    ]
  },
  {
    id: 'god',
    title: 'Abide',
    short: 'Abide',
    aim: 'Stay close to God — not as a task to finish before marriage, but as the root the whole thing grows from. This one never gets checked off.',
    verse: 'Abide in me, and I in you. As the branch cannot bear fruit by itself, unless it abides in the vine, neither can you, unless you abide in me.',
    ref: 'John 15:4',
    icon: 'vine',
    ongoing: true,
    steps: [
      { id: 'daily', title: 'Meet with God daily for 30 days without breaking', hint: 'Same time, same chair, open Bible.' },
      { id: 'nt', title: 'Read the whole New Testament', hint: 'Straight through. Mark what convicts you.' },
      { id: 'ot', title: 'Read through the Old Testament', hint: 'Slower, stranger, worth it.' },
      { id: 'memorize', title: 'Memorize passages you will need later', hint: 'Psalm 1, Romans 8, Ephesians 5, 1 Corinthians 13.' },
      { id: 'prayer', title: 'Keep a real prayer list — and write the answers down', hint: 'Faith is fed by remembering what He already did.' },
      { id: 'fast', title: 'Build a fasting rhythm', hint: 'Start with one meal, one day a week.' },
      { id: 'confess', title: 'Have one man who knows everything', hint: 'Unconfessed sin is the crack that widens under marriage.' },
      { id: 'sabbath', title: 'Keep a weekly Sabbath', hint: 'Prove you trust God with the day you did not work.' },
      { id: 'witness', title: 'Share your faith with someone this month', hint: 'A man who cannot speak of Christ outside will not lead worship inside.' }
    ]
  },
  {
    id: 'purity',
    title: 'Purity \u2014 Kept for Her',
    short: 'Purity',
    aim: 'Make the covenant with my eyes now, and keep it \u2014 so that what I bring her is whole, and so that the man at the altar is the same man in private.',
    verse: 'I have made a covenant with my eyes; how then could I gaze at a virgin?',
    ref: 'Job 31:1',
    icon: 'shield',
    priority: true,
    streakHabit: 'clean',
    steps: [
      { id: 'covenant', title: 'Write the covenant with your eyes \u2014 and date it', hint: 'Job made it a decision before it was a temptation. Sign your name to it.' },
      { id: 'access', title: 'Cut the access, on every device', hint: 'Filters, blockers, accountability software. Willpower alone has never once been enough.' },
      { id: 'night', title: 'Put the phone out of the bedroom', hint: 'Most of it happens late and alone. Remove the late and the alone.' },
      { id: 'brother', title: 'One man who gets the truth every week', hint: 'Not \u201cI struggled.\u201d The day, the hour, what happened, what you did next.' },
      { id: 'pattern', title: 'Name the pattern honestly', hint: 'When, where, and what you were feeling. It is almost never actually about lust.' },
      { id: 'escape', title: 'Decide now what you do in the moment', hint: 'Stand up, leave the room, call him, go outside. Decided in advance, not negotiated at 1am.' },
      { id: 'confess', title: 'Confess in hours, not weeks', hint: 'The hiding does more damage than the fall. Bring it into the light fast.' },
      { id: 'feed', title: 'Cut what feeds it upstream', hint: 'The shows, the accounts, the scroll, the second look. Guard the gate, not the room.' },
      { id: 'root', title: 'Go after the root', hint: 'Loneliness, stress, boredom, shame. Kill the cause or you will keep fighting the symptom.' },
      { id: 'grace', title: 'Receive the forgiveness and stop re-litigating it', hint: 'Condemnation is not conviction. One leads to repentance, the other to relapse.' },
      { id: 'ninety', title: 'Ninety clean days', hint: 'Long enough to prove it is a life and not a streak of good luck.' },
      { id: 'year', title: 'A clean year', hint: 'This is the one that changes what you believe about yourself.' },
      { id: 'honest', title: 'Be able to tell her the truth', hint: 'Where you have been, and where you actually are now. Aim to have a good answer ready.' }
    ]
  },
  {
    id: 'father',
    title: 'Learning to Be a Father',
    short: 'Father',
    aim: 'Start becoming — years early — the kind of father my children will one day describe. Learn it now, while it is still cheap to learn.',
    verse: 'Fathers, do not provoke your children to anger, but bring them up in the discipline and instruction of the Lord.',
    ref: 'Ephesians 6:4',
    icon: 'hands',
    steps: [
      { id: 'inventory', title: 'Write what you keep and what you leave from your own father', hint: 'Two honest columns. This is the most important page you will write.' },
      { id: 'books', title: 'Read three books on fatherhood and discipleship at home', hint: 'Take notes as if you will need them. You will.' },
      { id: 'around', title: 'Get around children regularly', hint: 'Church nursery, nieces, nephews, friends’ kids. Theory is not enough.' },
      { id: 'fathers', title: 'Interview three fathers you respect', hint: 'Ask what they would do differently. Write down every word.' },
      { id: 'anger', title: 'Deal with your anger and your patience now', hint: 'Children find the fault line. Fix it before they do.' },
      { id: 'worship', title: 'Learn how family worship actually works', hint: 'A song, a passage, a prayer. Practice it alone until it is natural.' },
      { id: 'skills', title: 'Learn the skills you want to hand down', hint: 'Fix, build, cook, work with your hands, tell the truth well.' },
      { id: 'cost', title: 'Count the cost of children honestly', hint: 'Time, money, sleep, freedom. Decide now that it is worth it.' },
      { id: 'legacy', title: 'Write a letter to your future child', hint: 'Date it. Keep it. Let it judge how you are living.' }
    ]
  },
  {
    id: 'pursuit',
    title: 'How I Will Pursue Her',
    short: 'Pursuit',
    aim: 'Decide in a clear season what I will do in an emotional one. This is written now and acted on later — not yet, and not by feeling.',
    verse: 'I adjure you, O daughters of Jerusalem, that you not stir up or awaken love until it pleases.',
    ref: 'Song of Solomon 2:7',
    icon: 'ring',
    later: true,
    steps: [
      { id: 'convictions', title: 'Write your convictions before emotions get a vote', hint: 'What you will and will not do, on paper, signed and dated.' },
      { id: 'looking', title: 'Name what you are actually looking for', hint: 'Character, faith, family, direction — and the three true non-negotiables.' },
      { id: 'clarity', title: 'Decide to speak with clarity, early', hint: 'No ambiguity. Say what your intentions are and let her answer freely.' },
      { id: 'family', title: 'Plan how you will honor her father and family', hint: 'Meet them early. Ask, do not announce.' },
      { id: 'counsel', title: 'Choose the two or three people you will tell first', hint: 'Men who will tell you no, and whose no you will accept.' },
      { id: 'boundaries', title: 'Set the purity boundaries in advance', hint: 'Where you go, how late, who is around, what you do not do.' },
      { id: 'pace', title: 'Decide the pace and the checkpoints', hint: 'Unhurried, but going somewhere. Not endlessly unclear.' },
      { id: 'counseling', title: 'Find where you would do pre-marital counseling', hint: 'A pastor or couple already lined up before it is needed.' },
      { id: 'ready', title: 'Know the signs that the season has come', hint: 'Church, provision, and character in place — then move without delay.' }
    ]
  }
];

export const HABITS = [
  { id: 'word', title: 'Time in the Word', cadence: 'daily', pillar: 'god' },
  { id: 'pray', title: 'Prayer', cadence: 'daily', pillar: 'god' },
  { id: 'clean', title: 'Clean day', cadence: 'daily', pillar: 'purity' },
  { id: 'train', title: 'Train', cadence: 'weekly', target: 4, pillar: 'body' },
  { id: 'read', title: 'Read 10 pages', cadence: 'daily', pillar: 'father' },
  { id: 'money', title: 'Check the budget', cadence: 'weekly', target: 1, pillar: 'provision' },
  { id: 'gather', title: 'Gather with the church', cadence: 'weekly', target: 1, pillar: 'church' },
  { id: 'rest', title: 'Sabbath / rest', cadence: 'weekly', target: 1, pillar: 'god' }
];

// One for each day of the month; the app picks by day-of-year so it rotates.
export const VERSES = [
  { text: 'Unless the LORD builds the house, those who build it labor in vain.', ref: 'Psalm 127:1' },
  { text: 'Commit your work to the LORD, and your plans will be established.', ref: 'Proverbs 16:3' },
  { text: 'He who finds a wife finds a good thing and obtains favor from the LORD.', ref: 'Proverbs 18:22' },
  { text: 'Wait for the LORD; be strong, and let your heart take courage; wait for the LORD!', ref: 'Psalm 27:14' },
  { text: 'Trust in the LORD with all your heart, and do not lean on your own understanding.', ref: 'Proverbs 3:5' },
  { text: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.', ref: 'Matthew 6:33' },
  { text: 'Be watchful, stand firm in the faith, act like men, be strong.', ref: '1 Corinthians 16:13' },
  { text: 'The plans of the diligent lead surely to abundance.', ref: 'Proverbs 21:5' },
  { text: 'Prepare your work outside; get everything ready for yourself in the field, and after that build your house.', ref: 'Proverbs 24:27' },
  { text: 'Whatever you do, work heartily, as for the Lord and not for men.', ref: 'Colossians 3:23' },
  { text: 'For we walk by faith, not by sight.', ref: '2 Corinthians 5:7' },
  { text: 'Let us not grow weary of doing good, for in due season we will reap, if we do not give up.', ref: 'Galatians 6:9' },
  { text: 'Husbands, love your wives, as Christ loved the church and gave himself up for her.', ref: 'Ephesians 5:25' },
  { text: 'A man’s steps are from the LORD; how then can man understand his way?', ref: 'Proverbs 20:24' },
  { text: 'Delight yourself in the LORD, and he will give you the desires of your heart.', ref: 'Psalm 37:4' },
  { text: 'Now faith is the assurance of things hoped for, the conviction of things not seen.', ref: 'Hebrews 11:1' },
  { text: 'Whoever is faithful in very little is also faithful in much.', ref: 'Luke 16:10' },
  { text: 'Do nothing from selfish ambition or conceit, but in humility count others more significant than yourselves.', ref: 'Philippians 2:3' },
  { text: 'Let all that you do be done in love.', ref: '1 Corinthians 16:14' },
  { text: 'The LORD is my shepherd; I shall not want.', ref: 'Psalm 23:1' },
  { text: 'Discipline yourself for the purpose of godliness.', ref: '1 Timothy 4:7' },
  { text: 'Better is the end of a thing than its beginning, and the patient in spirit than the proud in spirit.', ref: 'Ecclesiastes 7:8' },
  { text: 'Behold, children are a heritage from the LORD, the fruit of the womb a reward.', ref: 'Psalm 127:3' },
  { text: 'Make it your ambition to lead a quiet life, to mind your own affairs, and to work with your hands.', ref: '1 Thessalonians 4:11' },
  { text: 'My grace is sufficient for you, for my power is made perfect in weakness.', ref: '2 Corinthians 12:9' },
  { text: 'The heart of man plans his way, but the LORD establishes his steps.', ref: 'Proverbs 16:9' },
  { text: 'Be strong and courageous. Do not be frightened, for the LORD your God is with you wherever you go.', ref: 'Joshua 1:9' },
  { text: 'Charm is deceitful, and beauty is vain, but a woman who fears the LORD is to be praised.', ref: 'Proverbs 31:30' },
  { text: 'Cast your burden on the LORD, and he will sustain you.', ref: 'Psalm 55:22' },
  { text: 'And whatever you ask in prayer, you will receive, if you have faith.', ref: 'Matthew 21:22' },
  { text: 'He must manage his own household well.', ref: '1 Timothy 3:4' }
];

// Seeded once, then it is yours to edit, add to, or delete.
export const SEED_ENCOURAGEMENTS = [
  {
    id: 'aisle',
    title: 'The aisle',
    source: 'The vision He gave me',
    text:
      'I saw myself walking down the aisle, and I did not look to the right or to the left. ' +
      'Not at the pews. Not at the girls. Not at anyone. Only forward.\n\n' +
      'And she was there, waiting for me at the altar \u2014 and I knew it with a deep trust. ' +
      'Trust that God was the one bringing her.\n\n' +
      'That is how I want to walk now, years before the aisle. And that is how I want to walk ' +
      'after it, in the marriage: locked in, eyes forward, not looking to the right or to the left.',
    pinned: true
  }
];

// Fixed, not editable \u2014 for the days when the work is heavy.
export const PROMISES = [
  { text: 'No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape.', ref: '1 Corinthians 10:13' },
  { text: 'They who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.', ref: 'Isaiah 40:31' },
  { text: 'The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.', ref: 'Lamentations 3:22\u201323' },
  { text: 'And let us not grow weary of doing good, for in due season we will reap, if we do not give up.', ref: 'Galatians 6:9' },
  { text: 'There is therefore now no condemnation for those who are in Christ Jesus.', ref: 'Romans 8:1' },
  { text: 'He who began a good work in you will bring it to completion at the day of Jesus Christ.', ref: 'Philippians 1:6' },
  { text: 'Create in me a clean heart, O God, and renew a right spirit within me.', ref: 'Psalm 51:10' },
  { text: 'For the righteous falls seven times and rises again.', ref: 'Proverbs 24:16' }
];

export const PILLAR_BY_ID = Object.fromEntries(PILLARS.map((p) => [p.id, p]));
export const HABIT_BY_ID = Object.fromEntries(HABITS.map((h) => [h.id, h]));
