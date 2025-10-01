"use server";

import { cookies } from "next/headers";
import {
  decrypt,
  getSessionToken,
  getSessionObject,
  deleteSession,
} from "../lib/session";
import { GoogleGenAI } from "@google/genai";

export async function logout() {
  await deleteSession();
}

export async function getUserStats() {
  const projects = await getProjectsWithCookies();

  let sum = 0;

  // Combine drafts from all projects
  const drafts = projects.flatMap((project) => project.drafts || []);
  const wordCounts = drafts.map((draft) => draft.wordCount);

  wordCounts.forEach((count) => (sum += count));

  // Gather all chapters from all projects
  const allChapters = projects.flatMap((project) => project.chapters || []);

  const stats = {
    totalBooks: projects.length,
    totalDrafts: drafts.length,
    totalWords: sum,
    chaptersCompleted: allChapters.length,
  };

  return stats;
}

export async function getUser() {
  const token = await getSessionToken();
  const session = await getSessionObject();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/users/profile/${session.userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const result = await response.json();
  delete result.user.password;

  return result.user;
}

export async function getRecentDrafts() {
  const projects = await getProjectsWithCookies();
  const drafts = projects.flatMap((project) =>
    (project.drafts || []).map((draft) => ({
      ...draft,
      bookName: project.title,
    }))
  );

  return drafts.slice(0, 3);
}

export async function getRecentDrafts_noSlice() {
  const projects = await getProjectsWithCookies();
  const drafts = projects.flatMap((project) =>
    (project.drafts || []).map((draft) => ({
      ...draft,
      bookName: project.title,
    }))
  );

  return drafts;
}

export async function calcWritingStreak() {
  const recentDrafts = await getRecentDrafts_noSlice();
  const days = 6;
  const today = new Date();
  const streak = [];

  for (let i = 0; i <= days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const hasDraft = recentDrafts.some(
      (draft) => draft.lastEdited && draft.lastEdited.split("T")[0] === dateStr
    );

    streak.unshift({
      date: dateStr,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      hasWritten: hasDraft,
    });
  }

  // Calculate current streak (consecutive days from today backwards)
  let streakCount = 0;
  for (let i = streak.length - 1; i >= 0; i--) {
    if (streak[i].hasWritten) {
      streakCount++;
    } else {
      break;
    }
  }

  const streakObj = {
    currentStreak: streakCount,
    lastWeek: streak,
  };

  return streakObj;
}

export async function getUpcomingTasks() {
  const allTasks = await getTasks();

  //all the tasks for the upcoming week, i.e, 7 days from current date.
  const now = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(now.getDate() + 7);

  const upcomingTasks = allTasks.filter((task) => {
    const due = new Date(task.year, task.month, task.day);
    return due >= now && due <= oneWeekFromNow;
  });

  let result = upcomingTasks.map((task) => {
    const date = new Date(task.year, task.month, task.day).toDateString();

    // Calculate the delta in days between today and the due date
    const deltaMs = new Date(task.year, task.month, task.day) - now;
    const deltaDays = Math.ceil(deltaMs / (1000 * 60 * 60 * 24));
    let dateInWords =
      deltaDays > 1 ? `In ${deltaDays} days` : `In ${deltaDays} day`;

    return {
      id: task._id,
      title: task.fullTitle,
      dueDate: date,
      wordDate: dateInWords,
      priority: task.priority ? task.priority : "high",
    };
  });

  return result;
}

export async function getTemplates() {
  // Return static templates for now
  return ["Academic Essay", "Kids Story", "Research Notes", "Short Story"];
}

export async function getWritingGoals() {
  const today = new Date();
  const projects = await getProjectsWithCookies();
  const drafts = projects.flatMap((project) => project.drafts || []);

  if (drafts.length <= 0) {
    return {
      current: 0,
      target: 0,
      percentage: 0,
    };
  }

  let todayWords = 0;
  let yesterdayWords = 0;

  let todayDrafts = drafts.filter(
    (draft) =>
      draft.lastEdited.split("T")[0] === new Date().toISOString().split("T")[0]
  );
  todayDrafts.forEach((draft) => (todayWords += draft.wordCount));

  // Calculate yesterday's date in YYYY-MM-DD format
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let yesterdayDrafts = drafts.filter(
    (draft) => draft.lastEdited.split("T")[0] === yesterdayStr
  );
  yesterdayDrafts.filter((draft) => (yesterdayWords += draft.wordCount));

  let obj = {
    current: todayWords,
    target: yesterdayWords,
    percentage:
      todayWords === 0
        ? 0
        : yesterdayWords === 0
        ? 100 // If no previous data, consider it 100% progress
        : Math.round((todayWords / yesterdayWords) * 100),
  };

  return obj;
}

export async function getTokenFromCookies() {
  return await getSessionToken();
}

export async function getSession() {
  return await getSessionObject();
}

export async function askAI() {
  try {
    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return [{ error: "AI service not configured" }];
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });
    const recommedPrompt = `Based on the data you've got from the book's chapters, find improvement opportunities for each draft or chapter, and for each page in the draft or chapter. Summarize your improvement point/s as a call-to-action tip, for example: Consider varying sentence structure to improve flow... [short example/s], The character's motivation seems inconsistent with... [short example/s] so the user will react to this tip and take action to improve it. The improvement examples should rely on the input book/chapter/draft's information, and be correct grammarly. Keep on the current storyline's flow by maintaining story-like language, but consider what the writer would love to see. summarize your improvement points in some sort of tag or category, that the user will easily understand. Your output should be a JSON object following this structure: {improvementTitle: [what the improvement is about], improveTip: [example/s for improvement], tags: [tag or category for the improvement. array of strings]}.`;

    //collect all the chapters
    const projects = await getProjectsWithCookies();
    const allChapters = projects.flatMap((project) => project.chapters || []);

    // If no chapters available, return empty array
    if (!allChapters || allChapters.length === 0) {
      return [];
    }

    console.log(allChapters);

    let allSuggestions = [];

    for (const chapter of allChapters) {
      try {
        // Prepare the prompt for this chapter
        const chapterPrompt = `
        Chapter Title: ${chapter.title || "Untitled"}
        Pages: ${
          Array.isArray(chapter.pages)
            ? chapter.pages.map((p, i) => `Page ${i + 1}: ${p}`).join("\n")
            : "No pages provided."
        }
        Content: ${chapter.content || "No content provided."}
        `;

        // Call Gemini for this chapter
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          config: {
            systemInstruction: recommedPrompt,
            maxOutputTokens: 2000,
            temperature: 0.3,
          },
          contents: {
            parts: [{ text: chapterPrompt }],
          },
        });

        // Parse and store the suggestion
        let suggestion;
        try {
          let rawText =
            response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
          // Remove markdown code block notation (e.g., ```json ... ```)
          rawText = rawText
            .replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1")
            .trim();
          suggestion = JSON.parse(rawText);
        } catch (e) {
          suggestion = {
            error: "Invalid JSON from AI",
            improvementTitle: "Parsing Error",
            improveTip: "Unable to parse AI response",
            tags: ["Error"],
          };
        }

        allSuggestions.push({
          chapterId: chapter._id,
          improvementTitle: suggestion.improvementTitle || "No title",
          improveTip: suggestion.improveTip || "No suggestion available",
          tags: suggestion.tags || ["General"],
          error: suggestion.error,
        });
      } catch (chapterError) {
        // Handle individual chapter errors
        allSuggestions.push({
          chapterId: chapter._id,
          error: "Failed to process chapter",
          improvementTitle: "Processing Error",
          improveTip: "Unable to generate suggestions for this chapter",
          tags: ["Error"],
        });
      }
    }
    console.log(allSuggestions);
    
    return allSuggestions;
  } catch (error) {
    // Handle any top-level errors
    console.error("AI suggestions error:", error);
    return [
      {
        error: "AI service unavailable",
        improvementTitle: "Service Error",
        improveTip: "Unable to connect to AI service",
        tags: ["Error"],
      },
    ];
  }
}

export async function aiTextTool({ text, tool }) {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  let prompt;
  switch (tool) {
    case "Improve":
      prompt = `Improve the following text for grammar, clarity, and style, while keeping the original meaning and voice. Return only the improved text. you're multilingual and you're excellent in many languages, including hebrew.\n\nText:\n${text}`;
      break;
    case "Summarize":
      prompt = `Summarize the following text in 2-3 sentences, focusing on the main ideas. Return only the summary. you're multilingual and you're excellent in many languages, including hebrew.\n\nText:\n${text}`;
      break;
    case "Expand":
      prompt = `Expand the following text by adding more detail, description, or depth, while keeping the original intent and style. Return only the expanded text. you're multilingual and you're excellent in many languages, including hebrew.\n\nText:\n${text}`;
      break;
    case "Rewrite":
      prompt = `Rewrite the following text in a different way, using new phrasing and structure, but keeping the same meaning. Return only the rewritten text. you're multilingual and you're excellent in many languages, including hebrew.\n\nText:\n${text}`;
      break;
    default:
      throw new Error("Invalid tool selected");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: prompt,
      maxOutputTokens: 2000,
      temperature: 0.3,
    },
    contents: {
      parts: [{ text }],
    },
  });

  // Try to extract the AI's response as plain text
  let resultText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // Remove markdown code block notation if present
  resultText = resultText
    .replace(/```(?:[a-z]+)?\s*([\s\S]*?)\s*```/gi, "$1")
    .trim();

  return resultText;
}

//CRUD with Express
export async function getProjectsWithCookies() {
  //with cookie data - server side

  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  const decrypted = await decrypt(session?.value);
  const userId = decrypted.userId;

  //fetch projects from db
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${session.value}`,
      },
      method: "GET",
    }
  );
  return await response.json();
}

export async function updateDataToServer(selectedProject, updatedData, status) {
  const { userId } = await getSession();
  const token = await getSessionToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${selectedProject[0]._id}`,
    {
      headers: {
        Authentication: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        userId: userId,
        author: selectedProject[0].author,
        title: selectedProject[0].title,
        genres: selectedProject[0].genres,
        status: status || selectedProject.status,
        description: selectedProject[0].description,
        drafts: updatedData,
      }),
    }
  );
  const result = await response.json();

  return result;
}

export async function updateBook(updatedBook) {
  const token = getSessionToken();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${updatedBook._id}`, //projectId
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(updatedBook),
      }
    );

    if (!response.ok) {
      return await response.json();
    } else {
      return await response.json();
    }
  } catch (error) {
    return error;
  }
}

export async function createProject(newProject) {
  const { userId } = await getSession();
  const token = await getSessionToken();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/`,
      {
        headers: {
          Authentication: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          author: newProject.author,
          title: newProject.title,
          genres: newProject.genres,
          status: newProject.status,
          description: newProject.description,
          drafts: newProject.drafts,
          notes: newProject.notes,
          characters: newProject.characters,
          assets: newProject.assets,
        }),
      }
    );

    return await response.json();
  } catch (error) {
    return error;
  }
}

export async function deleteBook(bookToDelete, token) {
  const idToDelete = bookToDelete[0]._id; //ProjectId
  console.log(idToDelete);

  const getBookResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/books/${idToDelete}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    }
  );
  const bookObj = await getBookResponse.json();

  const delBookResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/books/${bookObj.book._id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    }
  );
  return await delBookResponse.json();
}

export async function deleteProject(idToDelete, token) {
  const delProjResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${idToDelete}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    }
  );
  return await delProjResponse.json();
}

export async function deleteDraft(parentProject, deleteConfirmId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${parentProject._id}/${deleteConfirmId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  } catch (err) {
    return err;
  }
}

export async function getTasks() {
  const sessionObj = await getSessionObject();
  const token = await getSessionToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/tasks/${sessionObj.userId}`,
    {
      headers: {
        Authentication: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();
  return result.tasks; // --> Array of task objects
}

export async function updateTask(task) {
  const sessionObj = await getSessionObject();
  const token = await getSessionToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/tasks/new`,
    {
      headers: {
        Authentication: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        task: task,
        userId: sessionObj.userId,
      }),
    }
  );

  return await response.json();
}

export async function deleteTask(taskId) {
  const sessionObj = await getSessionObject();
  const token = await getSessionToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/tasks/${taskId}`,
    {
      headers: {
        Authentication: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        userId: sessionObj.userId,
      }),
    }
  );
  return await response.json();
}

export async function login(email, password) {
  try {
    let result = await fetch(
      `${process.env.NEXT_PUBLIC_SERVICE}/api/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    return await result.json();
  } catch (error) {
    return { error };
  }
}

export async function getVersions(project, token) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/versions/${project[0]._id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await res.json();
}

export async function getGoals() {
  const sessionObj = await getSessionObject();
  const token = await getSessionToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVICE}/api/goals/${sessionObj.userId}`,
    {
      headers: {
        Authentication: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();
  return result.goals; // --> Array of task objects
}
