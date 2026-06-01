import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { data, error } = await supabase.storage
    .from('derbii-media')
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = supabase.storage
    .from('derbii-media')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: urlData.publicUrl, path: data.path })
}
