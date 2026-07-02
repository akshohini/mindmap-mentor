const express = require("express");
const router = express.Router();

const Groq = require("groq-sdk");
const protect = require("../middleware/auth");
const User = require("../models/User");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/analyze", protect, async (req, res) => {

try {

const mode = req.body.mode;
console.log("MODE =", mode);

if(mode === "tasks"){

const prompt = `

You are a world-class productivity coach and study mentor.

Today's tasks:

${req.body.tasks.join("\n")}

Generate:

1. A highly personalized daily motivation.
2. A realistic daily schedule.

Return ONLY valid JSON.

Format:

{
"dailyMotivation":"",
"dailySchedule":[
{
"time":"",
"task":"",
"duration":"",
"focus":"",
"tips":""
}
]
}

RULES:

- Use ONLY the user's tasks.
- NEVER invent new tasks.
- NEVER generate:
  - Focus block
  - Morning block
  - Review priorities
  - Reflect and reset
  - High-energy session
  - Progress block

- Hard tasks should come first.
- Sports or gym should be in evening.
- Duration should be realistic.
- Focus must explain WHAT TO STUDY.
- Tips should be practical and actionable.

Examples:

Task: Operating System
Focus: CPU Scheduling, Deadlocks and Memory Management

Task: DBMS
Focus: SQL Queries and Normalization

Task: DSA
Focus: Arrays, Sliding Window and Binary Search

Task: Computer Networks
Focus: TCP/IP and Routing

Task: Badminton
Focus: Footwork and consistency

Motivation must:
- Mention today's tasks.
- Be encouraging.
- Avoid quotes.
- Sound like a mentor.

`;
const completion = await groq.chat.completions.create({

model:"meta-llama/llama-4-scout-17b-16e-instruct",

messages:[
{
role:"user",
content:prompt
}
]

});

let response = completion.choices[0].message.content;

response = response
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

const data = JSON.parse(response);

console.log(data);

// SAVE TO MONGODB

req.user.tasks = req.body.tasks;

req.user.dailyMotivation = data.dailyMotivation;

req.user.dailySchedule = data.dailySchedule;
console.log(data.dailySchedule);
await req.user.save();
console.log(req.user.dailyMotivation);
console.log(req.user.dailySchedule);

console.log("Saved successfully");

return res.json(data);

}
if(mode === "studyplanner"){

const prompt = `

You are an expert exam mentor.

Subject:
${req.body.subject}

Exam after:
${req.body.examDays} days

Study hours available:
${req.body.studyHours} hours/day

Current level:
${req.body.level}

Target:
${req.body.target}

Weak topics:
${req.body.weakTopics}

Return ONLY JSON.

Format:

{
"studyPlan":[
{
"day":"",
"topics":[]
}
]
}

RULES:

- Beginners start from fundamentals.
- Intermediate students focus on concepts and practice.
- Advanced students focus on revision and PYQs.
- Weak topics must receive extra attention.
- Last 3 days should be revision only.
- Distribute study load realistically.
- Every student should receive a different plan.
- Avoid generic advice.
Return ONLY valid JSON.
Do not use markdown.
Do not use line breaks inside strings.
Do not add explanations.

`;

const completion = await groq.chat.completions.create({

model:"meta-llama/llama-4-scout-17b-16e-instruct",

messages:[
{
role:"user",
content:prompt
}
]

});

let response = completion.choices[0].message.content;

response = response
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

let data;

try {
  data = JSON.parse(response);
} catch {

  response = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, " ")
    .replace(/\r/g, "")
    .trim();

  data = JSON.parse(response);
}

req.user.studyPlan = data.studyPlan;

await req.user.save();

return res.json(data);

}
if(mode === "career"){

const prompt = `

You are an expert career counselor.

Student Profile:

CGPA: ${req.body.cgpa}
Study Hours: ${req.body.study}
Sleep Hours: ${req.body.sleep}
Screen Time: ${req.body.screen}

Stress Level: ${req.body.stress}
Energy Level: ${req.body.energy}
Procrastination Level: ${req.body.procrastination}

Strong Subjects: ${req.body.strong}
Weak Subjects: ${req.body.weak}

Interests: ${req.body.interest}

Dream Career: ${req.body.dreamCareer}

Return ONLY valid JSON.

Format:

{
  "summary": "",
  "dailyMotivation": "",
  "careers": [
    {
      "title": "",
      "emoji": "",
      "match": 85,
      "why": "",
      "skills": []
    }
  ]
}

RULES:

- Return exactly 3 careers.
- Careers must primarily depend on the student's interests.
- Strong subjects should significantly increase the match score.
- Weak subjects should slightly decrease the match score.
- Higher CGPA should increase the match score.
- Higher study hours should increase the match score.
- High stress should slightly reduce the match score.
- If the dream career matches one of the recommendations, give it the highest match.
- Match score must be between 70 and 98.
- Never return 0.
- Never return the same match score for every career.
- Explain clearly why each career fits.
- Provide 3–5 relevant skills for each career.

`;

const completion = await groq.chat.completions.create({

model:"meta-llama/llama-4-scout-17b-16e-instruct",

messages:[
{
role:"user",
content:prompt
}
]

});

let response = completion.choices[0].message.content;

response = response
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();
console.log(response);
const data = JSON.parse(response);

// Save careers to MongoDB
req.user.careerResult = data.careers;

// Save motivation too
req.user.dailyMotivation = data.dailyMotivation;

await req.user.save();

return res.json(data);

}
if(mode === "roadmap"){

const prompt = `

You are an expert career mentor.

Selected Career:
${req.body.career}

Student Details:

CGPA: ${req.body.cgpa}
Study Hours: ${req.body.study}
Sleep Hours: ${req.body.sleep}
Stress Level: ${req.body.stress}
Energy Level: ${req.body.energy}
Procrastination Level: ${req.body.procrastination}

Strong Subjects:
${req.body.strong}

Weak Subjects:
${req.body.weak}

Short Goal:
${req.body.shortGoal}

Long Goal:
${req.body.longGoal}

Dream Career:
${req.body.dreamCareer}

Return ONLY JSON.

Format:

{
"roadmap":[
{
"phase":"",
"title":"",
"steps":[]
}
]
}

RULES:

- Create 4 phases:
  0-3 Months
  3-6 Months
  6-12 Months
  1-2 Years

- Steps must be realistic.
- Include skills, projects and interview preparation.
- Use strengths and weaknesses.
- Avoid generic advice.

`;

const completion = await groq.chat.completions.create({

model:"meta-llama/llama-4-scout-17b-16e-instruct",

messages:[
{
role:"user",
content:prompt
}
]

});

let response = completion.choices[0].message.content;

response = response
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

const data = JSON.parse(response);

req.user.roadmap = data.roadmap;

await req.user.save();

return res.json(data);

}
if(mode === "weeklyreview"){

const prompt = `

You are an encouraging productivity coach.

Productivity Score:
${req.body.productivity}

Study Streak:
${req.body.studyStreak}

Exercise Streak:
${req.body.exerciseStreak}

Return ONLY valid JSON.

Format:

{
"strengths":[],
"improvements":[],
"motivation":"",
"nextWeekGoals":[]
}

Rules:

- strengths must contain 3 bullet points.
- improvements must contain 3 bullet points.
- nextWeekGoals must contain 3 bullet points.
- motivation should be only 1-2 sentences.
- Keep points short and practical.
- No markdown.
- No headings.
- No paragraphs.
- Avoid generic quotes.

`;

const completion = await groq.chat.completions.create({

model:"meta-llama/llama-4-scout-17b-16e-instruct",

messages:[
{
role:"user",
content:prompt
}
]

});

let response = completion.choices[0].message.content;

response = response
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

let data;

try {
  data = JSON.parse(response);
} catch {

  response = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, " ")
    .replace(/\r/g, "")
    .trim();

  data = JSON.parse(response);
}

// Save to MongoDB
req.user.weeklyReview = data.review;

await req.user.save();

return res.json(data);

}
}
catch(err){

console.log(err);

res.status(500).json({
error:"AI generation failed"
});

}

});

module.exports = router;