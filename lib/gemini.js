import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateBlog(transcript) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
You are a professional blog writer. 
Based on the following YouTube video transcript, write a well-structured blog post.
Include a title, introduction, main sections with headings, and a conclusion.
Make it engaging and easy to read.

Transcript:
${transcript}
  `

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}