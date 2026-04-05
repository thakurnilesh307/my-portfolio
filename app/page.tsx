import Nav from './components/Nav'
import Hero from './components/Hero'
import Now from './components/Now'
import Footer from './components/Footer'
import { getNowItems } from '../lib/notion'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // @ts-ignore
  const nowItems = await getNowItems()

  return (
    <main>
      <Nav />
      <Hero />
      <div className="container">
        <Now items={nowItems} />
        <Footer />
      </div>
    </main>
  )
}
