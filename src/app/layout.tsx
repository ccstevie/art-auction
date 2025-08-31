import './globals.css'
import { Providers } from './providers'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <Navbar />
          <main className="container mx-auto p-6">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
