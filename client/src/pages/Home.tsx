import { FolderOpen } from 'lucide-react'
import { Button } from '../components/ui'
export default function Home({ onOpen }: { onOpen: () => void }) {
  return <main className="h-[calc(100%-120px)] grid place-items-center"><Button variant="primary" className="!h-12 !px-7 text-[15px]" onClick={onOpen}><FolderOpen size={18} />Open a case</Button></main>
}
