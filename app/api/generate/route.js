import { YoutubeTranscript } from 'youtube-transcript'
import { generateBlog } from '@/lib/gemini'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { url, userId } = await request.json()

    // Step 1: Fetch the transcript
    const transcriptData = await YoutubeTranscript.fetchTranscript(url)
    const transcript = transcriptData.map(item => item.text).join(' ')

    if (!transcript) {
      return NextResponse.json({ error: 'Could not fetch transcript. Make sure the video has captions.' }, { status: 400 })
    }

    // Step 2: Generate blog with Gemini
    const blogContent = await generateBlog(transcript)

    // Step 3: Extract a title (first line of the generated content)
    const lines = blogContent.split('\n').filter(line => line.trim() !== '')
    const title = lines[0].replace(/^#\s*/, '')

    // Step 4: Save to Supabase
    const { data, error } = await supabase
      .from('blogs')
      .insert([{ user_id: userId, yt_url: url, title, content: blogContent }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ blog: data })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}