import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Music,
  Pen,
  Code,
  Palette,
  Briefcase,
  PlayCircle,
  Headphones,
  GraduationCap,
  Cloud,
  MessageSquare,
  BarChart3,
  Layers,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  image: ImageIcon,
  video: Video,
  music: Music,
  pen: Pen,
  code: Code,
  palette: Palette,
  briefcase: Briefcase,
  play: PlayCircle,
  headphones: Headphones,
  graduation: GraduationCap,
  cloud: Cloud,
  message: MessageSquare,
  chart: BarChart3,
}

export function iconFor(name: string | null | undefined): LucideIcon {
  if (!name) return Layers
  return map[name] ?? Layers
}

const colors = [
  '#d4a853',
  '#2ec4b6',
  '#9b5de5',
  '#00b4d8',
  '#f77f00',
  '#06d6a0',
  '#118ab2',
  '#ef476f',
  '#e63946',
  '#f4a261',
  '#7b2cbf',
  '#22c55e',
  '#3b82f6',
  '#fb7185',
]

export function colorForCategory(slug: string): string {
  let h = 0
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0
  }
  return colors[h % colors.length]
}
