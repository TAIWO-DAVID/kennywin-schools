'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, GraduationCap, Microscope, Languages, Computer, Palette, HeartPulse, BookText, Atom, Globe2, Users, Sparkles, BadgeCheck, ArrowRight } from 'lucide-react'
import TeachingPhilosophyCarousel from '@/components/academics/teaching-philosophy-carousel'
import SubjectGrid from '@/components/academics/subject-grid'
import PhotoGallery from '@/components/academics/photo-gallery'
import { useEffect } from 'react'

// Nursery (Early Years) Departments
const nurseryDepartments = [
  {
    name: 'Literacy & Numeracy',
    icon: BookOpen,
    description: 'Play-based foundations in phonics, pre-writing, counting, and patterns.',
    subjects: [
      { name: 'Pre-Reading & Phonics', summary: 'Sounds, letters, and early vocabulary.' },
      { name: 'Early Numeracy', summary: 'Numbers, shapes, sorting, and simple operations.' },
    ],
  },
  {
    name: 'Exploratory Science',
    icon: Microscope,
    description: 'Sensory exploration and discovery of the world around us.',
    subjects: [
      { name: 'Nature & Senses', summary: 'Observation, comparison, and curiosity.' },
      { name: 'STEM Play', summary: 'Blocks, builds, simple experiments.' },
    ],
  },
  {
    name: 'Social & Values',
    icon: Globe2,
    description: 'Kindness, sharing, routines, and values in a safe community.',
    subjects: [
      { name: 'Social Habits', summary: 'Turn-taking, listening, and empathy.' },
      { name: 'Biblical Values', summary: 'Stories, songs, and character.' },
    ],
  },
  {
    name: 'Arts & Movement',
    icon: Palette,
    description: 'Creative expression and healthy movement.',
    subjects: [
      { name: 'Creative Arts', summary: 'Drawing, painting, crafts, and songs.' },
      { name: 'Movement', summary: 'Fine and gross motor skills, basic P.E.' },
    ],
  },
  {
    name: 'ICT Foundations',
    icon: Computer,
    description: 'Gentle introduction to devices and safe use.',
    subjects: [{ name: 'ICT Play', summary: 'Mouse control, shapes, colors, and safety.' }],
  },
]

// Primary Departments
const primaryDepartments = [
  {
    name: 'Core',
    icon: BookOpen,
    description: 'Foundational literacy and numeracy for life-long learning.',
    subjects: [
      { name: 'English Language', summary: 'Comprehension, grammar, writing, and oracy.' },
      { name: 'Mathematics', summary: 'Number sense, problem solving, and reasoning.' },
    ],
  },
  {
    name: 'Sciences',
    icon: Microscope,
    description: 'Hands-on exploration of the world around us.',
    subjects: [{ name: 'Basic Science & Technology', summary: 'Inquiry, observation, and design thinking.' }],
  },
  {
    name: 'Social Studies',
    icon: Globe2,
    description: 'Community, culture, and citizenship.',
    subjects: [
      { name: 'Social Studies', summary: 'Identity, history, and social responsibility.' },
      { name: 'Civic Education', summary: 'Active citizenship and leadership.' },
    ],
  },
  {
    name: 'Languages',
    icon: Languages,
    description: 'Communication and cultural appreciation.',
    subjects: [{ name: 'Yoruba', summary: 'Language, culture, and identity.' }],
  },
  {
    name: 'ICT',
    icon: Computer,
    description: 'Digital literacy for the modern world.',
    subjects: [{ name: 'Computer Studies', summary: 'Typing, research, and safety online.' }],
  },
  {
    name: 'Arts & Wellbeing',
    icon: Palette,
    description: 'Creativity, expression, and healthy living.',
    subjects: [
      { name: 'Creative Arts', summary: 'Visual arts, crafts, and performance.' },
      { name: 'Physical & Health Education', summary: 'Fitness, teamwork, and healthy habits.' },
    ],
  },
  {
    name: 'Values',
    icon: BadgeCheck,
    description: 'Faith, character, and integrity.',
    subjects: [{ name: 'Christian Religious Knowledge (CRK)', summary: 'Values and biblical worldview.' }],
  },
]

// Secondary Departments
const secondaryDepartments = [
  {
    name: 'English & Literature',
    icon: BookText,
    description: 'Advanced communication, analysis, and literature.',
    subjects: [
      { name: 'English Language', summary: 'Composition, rhetoric, and mastery of language.' },
      { name: 'Literature-in-English', summary: 'Texts, themes, and critical interpretation.' },
    ],
  },
  {
    name: 'Mathematics',
    icon: Atom,
    description: 'Abstract thinking and quantitative reasoning.',
    subjects: [
      { name: 'General Mathematics', summary: 'Algebra, geometry, statistics.' },
      { name: 'Further Mathematics', summary: 'Advanced topics and problem solving.' },
    ],
  },
  {
    name: 'Sciences',
    icon: Microscope,
    description: 'Scientific inquiry and laboratory practice.',
    subjects: [
      { name: 'Biology', summary: 'Life systems and ecology.' },
      { name: 'Chemistry', summary: 'Matter, reactions, and analysis.' },
      { name: 'Physics', summary: 'Forces, energy, and motion.' },
      { name: 'Basic Technology', summary: 'Design, tools, and craftsmanship.' },
    ],
  },
  {
    name: 'Social Sciences',
    icon: Globe2,
    description: 'Society, economy, and governance.',
    subjects: [
      { name: 'Geography', summary: 'People, place, and environment.' },
      { name: 'Economics', summary: 'Markets, development, and decisions.' },
      { name: 'Government', summary: 'Institutions and civic structure.' },
      { name: 'Civic Education', summary: 'Citizenship and leadership.' },
    ],
  },
  {
    name: 'ICT',
    icon: Computer,
    description: 'Programming and responsible technology use.',
    subjects: [
      { name: 'Computer Studies', summary: 'Computing fundamentals and productivity tools.' },
      { name: 'Data Processing', summary: 'Information systems and analysis.' },
    ],
  },
  {
    name: 'Arts',
    icon: Palette,
    description: 'Creative practice and cultural expression.',
    subjects: [
      { name: 'Fine Arts', summary: 'Drawing, painting, and design.' },
      { name: 'Music', summary: 'Performance and theory.' },
      { name: 'Theatre Arts', summary: 'Drama, staging, and performance.' },
    ],
  },
  {
    name: 'Values',
    icon: BadgeCheck,
    description: 'Ethics, character, and faith.',
    subjects: [{ name: 'Christian Religious Studies (CRS)', summary: 'Faith, ethics, and service.' }],
  },
]

// Accent scrollbar (subtle cohesive touch)
function useAccentScrollbar() {
  useEffect(() => {
    const prev = document.documentElement.style.scrollbarColor
    document.documentElement.style.scrollbarColor = '#d97706 #f8fafc' // amber-600 on slate-50
    return () => {
      document.documentElement.style.scrollbarColor = prev
    }
  }, [])
}

export default function AcademicsPage() {
  useAccentScrollbar()

  // Galleries per level
  const nurseryGallery = [
    { src: '/creche-playtime.png', alt: 'Creche playtime' },
    { src: '/nursery-activities.png', alt: 'Nursery activities' },
    { src: '/nursery-reading-circle.png', alt: 'Reading circle in nursery' },
    { src: '/library-study.png', alt: 'Early years library corner' },
  ]
  const primaryGallery = [
    { src: '/primary-classroom.png', alt: 'Primary classroom' },
    { src: '/primary-arts.png', alt: 'Primary arts session' },
    { src: '/primary-sports.png', alt: 'Primary sports and P.E.' },
    { src: '/computer-lab.png', alt: 'Primary ICT lab' },
  ]
  const secondaryGallery = [
    { src: '/science-lab.png', alt: 'Secondary science laboratory' },
    { src: '/computer-lab.png', alt: 'Secondary computer lab' },
    { src: '/library-study.png', alt: 'Secondary library study' },
    { src: '/modern-classroom-study.png', alt: 'Modern classroom' },
  ]

  return (
    <main style={{
            // backgroundImage: "url('/images/academic_bg.jpg')",
            // backgroundSize: "cover",
            // backgroundPosition: "center",
            // backgroundRepeat: "no-repeat",
            // minHeight: "100vh", // ensures it covers full screen
        }} className="bg-white text-slate-800">
        <div  >
          {/* Hero */}
          <section className="relative border-b ">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 sm:py-18 lg:grid-cols-2 lg:py-24">
              <div className="animate-in slide-in-from-left-8 fade-in-50 duration-700">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  Academic Life
                </div>
                <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  Academics that Inspire Excellence
                </h1>
                <p className="mt-3 max-w-prose text-lg text-slate-600">
                  A formal yet vibrant learning experience—discipline, curiosity, and character development
                  guided by committed educators.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#curriculum" className="inline-flex">
                    <Button className="bg-amber-600 text-white hover:bg-amber-700">
                      Explore Curriculum
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="#philosophy" className="inline-flex">
                    <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                      Our Philosophy
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative animate-in slide-in-from-right-8 fade-in-50 duration-700">
                <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm">
                  <img
                    src="/modern-classroom-study.png"
                    alt="Students collaborating in a modern classroom"
                    className="h-auto w-full rounded-xl object-cover transition duration-500 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="pointer-events-none absolute -bottom-6 -right-6 hidden rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-amber-700 backdrop-blur sm:block">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4" /> Raising Standard-Bearers
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Teaching Philosophy with Carousel */}
          <section id="philosophy" className="border-b bg-slate-50/60">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:py-18">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-semibold text-slate-900">Teaching Philosophy</h2>
                <p className="mt-2 text-slate-600">
                  We blend rigorous academics with creativity, values, and student-centered instruction.
                </p>
              </div>
              <div className="mt-8">
                <TeachingPhilosophyCarousel />
              </div>
            </div>
          </section>

          {/* Curriculum Tabs (Nursery, Primary, Secondary) */}
          <section id="curriculum" className="border-b bg-white">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:py-18">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900">Curriculum Overview</h2>
                  <p className="mt-2 max-w-2xl text-slate-600">
                    Explore subjects by department. Hover to flip a card and learn more. Each level includes a
                    photo gallery from creche to secondary showcasing learning spaces and labs.
                  </p>
                </div>
              </div>

              <Tabs defaultValue="nursery" className="w-full">
                <TabsList className="mx-auto grid w-full max-w-2xl grid-cols-3 bg-slate-100">
                  <TabsTrigger value="nursery" className="data-[state=active]:bg-white data-[state=active]:text-amber-700">
                    Nursery
                  </TabsTrigger>
                  <TabsTrigger value="primary" className="data-[state=active]:bg-white data-[state=active]:text-amber-700">
                    Primary
                  </TabsTrigger>
                  <TabsTrigger value="secondary" className="data-[state=active]:bg-white data-[state=active]:text-amber-700">
                    Secondary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="nursery" className="mt-8 space-y-10">
                  <SubjectGrid departments={nurseryDepartments} accent="primary" />
                  <PhotoGallery title="Nursery & Creche Gallery" images={nurseryGallery} />
                </TabsContent>

                <TabsContent value="primary" className="mt-8 space-y-10">
                  <SubjectGrid departments={primaryDepartments} accent="primary" />
                  <PhotoGallery title="Primary Gallery" images={primaryGallery} />
                </TabsContent>

                <TabsContent value="secondary" className="mt-8 space-y-10">
                  <SubjectGrid departments={secondaryDepartments} accent="secondary" />
                  <PhotoGallery title="Secondary Gallery (Labs & Activities)" images={secondaryGallery} />
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Closing CTA */}
          <section className="bg-slate-50/60">
            <div className="mx-auto max-w-7xl px-4 py-12">
              <Card className="border-amber-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Users className="h-5 w-5 text-amber-600" />
                    Partnering with Parents
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Let’s build a learning journey that is challenging, joyful, and purposeful.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <a href="/enroll" className="inline-flex">
                    <Button className="bg-amber-600 text-white hover:bg-amber-700">
                      Admissions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="/contact" className="inline-flex">
                    <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                      Contact Us
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </section>
      </div>
    </main>
  )
}
