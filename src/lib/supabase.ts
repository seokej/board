import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Supabase 환경 변수가 없습니다. 프로젝트 루트에 .env 파일을 만들고 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 설정하세요.',
  )
}

export const supabase = createClient(url, anonKey)
