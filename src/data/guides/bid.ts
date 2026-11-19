/* How to Bid a Cleaning Job — data */

export const BID_STEPS = [
  { n: 1, title: "Walk the building", summary: "Never bid from a phone call. Walk every room, hallway, restroom and entrance, during business hours.",
    actions: ["Meet the decision-maker on site", "Visit during business hours to see real traffic", "Bring a measuring wheel, clipboard and camera", "Ask for a floor plan", "Note existing complaints"],
    tip: "Dress professionally. The walkthrough is the first sales call." },
  { n: 2, title: "Measure the square footage", summary: "Accurate square footage is the foundation of the bid. Measure every cleanable area and separate hard floor, carpet and restrooms.",
    actions: ["Measuring wheel for large areas", "Separate hard floor, carpet and tile", "Count restroom square footage on its own (it costs more)", "Note storage areas (less cleaning)", "Record ceiling heights for high dusting"],
    tip: "Ask the property manager for total square footage, then verify it. Their number often includes mechanical rooms you'll never clean." },
  { n: 3, title: "Define the scope", summary: "Put daily, weekly and monthly tasks in writing before you price anything.",
    actions: ["Daily: trash, vacuum, mop, restrooms, break room", "Weekly: dusting, glass, restroom detail", "Monthly: strip and wax, deep carpet, high dusting", "Specials: windows, pressure washing, post-construction", "A frequency for every task (1×, 3×, 5× a week)"],
    tip: "Scope creep kills profit. If it isn't in the contract, it's an extra." },
  { n: 4, title: "Estimate labor hours", summary: "Labor is 50–70% of the bid. Work out the hours per visit from square footage and the task list.",
    actions: ["One janitor cleans 2,500–3,500 sq ft an hour", "Budget 15–20 minutes per restroom", "Vacuuming: about 3,000 sq ft an hour", "Mopping: about 4,000 sq ft an hour", "Add travel, setup and supervision time"],
    tip: "Time yourself on a sample area during the walkthrough. Real numbers beat estimates." },
  { n: 5, title: "Price the supplies", summary: "Chemicals, paper, liners and equipment wear usually run 5–10% of the bid.",
    actions: ["Chemicals: $0.02–0.05 per sq ft per month (from concentrate)", "Towels and tissue: $0.01–0.03", "Liners: $0.005–0.015", "Equipment wear: $0.005–0.01", "Gloves and misc: $0.005"],
    tip: "Buy concentrates and dilute on site. One gallon of concentrate makes 32–128 gallons of cleaner." },
  { n: 6, title: "Add overhead and profit", summary: "Insurance, vehicle, office, taxes and your management time are real costs. Profit is what keeps you open.",
    actions: ["Overhead: 15–25% of direct costs", "General liability insurance (most contracts require it)", "Workers' comp (legally required for employees)", "Fuel and vehicle upkeep", "Profit target: 10–25% on commercial work"],
    tip: "Under 10% net profit means you're working for free once surprises hit." },
  { n: 7, title: "Present the bid", summary: "Cover page, scope of work, pricing breakdown, insurance certificates and references. Present it in person.",
    actions: ["Break pricing out by service, not one lump sum", "Attach insurance certificates", "Three or more references from similar buildings", "Offer a 30-day trial to lower their risk", "Use a clean proposal template"],
    tip: "Offer three tiers (basic, standard, premium). Most clients pick the middle, and it gives you room to negotiate." },
];

export const BENCHMARKS = [
  { facility: "General office", low: 0.05, high: 0.15, avg: 0.08, freq: "5× / week", note: "The most common contract" },
  { facility: "Medical / dental", low: 0.10, high: 0.25, avg: 0.15, freq: "5–7× / week", note: "OSHA and biohazard requirements" },
  { facility: "Restaurant / food service", low: 0.12, high: 0.20, avg: 0.15, freq: "7× / week", note: "Grease and health-department standards" },
  { facility: "School / daycare", low: 0.06, high: 0.12, avg: 0.08, freq: "5× / week", note: "High traffic, summer schedule" },
  { facility: "Hotel / hospitality", low: 0.08, high: 0.18, avg: 0.12, freq: "7× / week", note: "Public areas and meeting rooms" },
  { facility: "Industrial / warehouse", low: 0.03, high: 0.08, avg: 0.05, freq: "3–5× / week", note: "Large area, basic cleaning" },
];

export const SUPPLY_SKUS = ["3158", "91101", "CL404814", "5300", "5602", "8602EA"];

export const WALKTHROUGH = [
  { area: "Floors", items: ["Total square footage", "Carpet vs. hard floor", "Floor type (VCT, epoxy, concrete, tile)", "Condition: wax buildup, stains, damage", "Special areas: gym, kitchen, lab"] },
  { area: "Restrooms", items: ["Number of restrooms", "Fixtures: toilets, urinals, sinks", "Dispenser types", "Condition and odor issues", "ADA needs"] },
  { area: "Windows & glass", items: ["Interior glass doors and partitions", "Exterior windows, inside and out", "Window height (ladder needed?)", "Frequency requested"] },
  { area: "Special needs", items: ["Post-construction cleanup", "Biohazard or medical waste", "Security: background checks, keys", "Green-cleaning requirements", "Chemical restrictions"] },
];

export const MISTAKES = [
  { mistake: "Bidding without a walkthrough", risk: "You miss floor types, restroom counts and traffic. The bid is too low or too high.", fix: "Visit in person, every time." },
  { mistake: "Forgetting overhead", risk: "You win the job and lose money each month to insurance, fuel and taxes.", fix: "Add 15–25% on top of direct costs." },
  { mistake: "Pricing by the hour", risk: "Clients expect you to get faster; your costs don't drop. Quality slips.", fix: "Bid per square foot or a flat monthly rate." },
  { mistake: "No written scope", risk: "The client keeps asking for more without paying more.", fix: "A detailed scope with a change-order process." },
  { mistake: "Underestimating restrooms", risk: "Restrooms take 3–4× longer per square foot. Your crew runs late every night.", fix: "Budget 15–20 minutes per restroom per visit." },
  { mistake: "Skipping the trial period", risk: "You sign 12 months and discover the building is harder than it looked.", fix: "Offer a 30–60 day trial. It protects both sides." },
];
