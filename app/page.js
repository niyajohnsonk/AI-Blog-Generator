'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [url, setUrl] = useState('')
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
    })
  }, [])

  async function handleGenerate() {
    if (!url) return
    setLoading(true)
    setError('')
    setBlog(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, userId: user.id }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setBlog(data.blog)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">YT Blog Generator</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition text-sm"
          >
            My Blogs
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-2 text-center">
          Turn any YouTube video into a blog
        </h2>
        <p className="text-gray-400 text-center mb-10">
          Paste a YouTube link and get a full blog post in seconds
        </p>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="flex-1 bg-gray-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !url}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}

        {/* Blog output */}
        {blog && (
          <div className="mt-10 bg-gray-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">{blog.title}</h3>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {blog.content}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}