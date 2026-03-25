'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error) setBlogs(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">YT Blog Generator</h1>
        <button
          onClick={() => router.push('/')}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          ← Generate new blog
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">My Blogs</h2>

        {loading && (
          <p className="text-gray-400">Loading your blogs...</p>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No blogs yet.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              Generate your first blog
            </button>
          </div>
        )}

        {/* Blog list + detail view */}
        {blogs.length > 0 && (
          <div className="flex gap-6">
            {/* List */}
            <div className="w-1/3 flex flex-col gap-3">
              {blogs.map(blog => (
                <div
                  key={blog.id}
                  onClick={() => setSelected(blog)}
                  className={`cursor-pointer p-4 rounded-xl border transition ${
                    selected?.id === blog.id
                      ? 'border-blue-500 bg-gray-800'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                  }`}
                >
                  <p className="font-semibold text-sm line-clamp-2">{blog.title}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-xs mt-1 truncate">{blog.yt_url}</p>
                </div>
              ))}
            </div>

            {/* Detail */}
            <div className="flex-1 bg-gray-900 rounded-2xl p-8">
              {selected ? (
                <>
                  <h3 className="text-2xl font-bold mb-4">{selected.title}</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Generated on {new Date(selected.created_at).toLocaleDateString()} ·{' '}
                    
                      <a href={selected.yt_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Watch video</a>
                  </p>
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selected.content}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Select a blog to read it</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}