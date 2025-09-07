import Footer from '@/component/common/Footer'
import './globals.css'
import Header from '@/component/common/Header'
import AuthProvider from '../../providers/AuthProvider'




export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}