'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [logoError, setLogoError] = useState(false)

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          {!logoError ? (
            <img
              src="/operon-logo.png"
              alt="Operon Middle East Logo"
              className="w-48 h-48 object-contain rounded-2xl shadow-2xl"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-48 h-48 bg-black rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-3xl font-bold tracking-wider">OPERON</div>
                <div className="text-xs text-green-300 mt-2">AN EDGENTA COMPANY</div>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          OPERON MIDDLE EAST
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-green-200 mb-8">
          ISO IMS PORTAL
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg text-green-50 mb-10 leading-relaxed max-w-2xl mx-auto">
          The Integrated Management System (IMS) provides a unified framework governing 
          Quality, Environmental, Occupational Health &amp; Safety, and Facility Management 
          practices. It ensures standardized processes, regulatory compliance, continual 
          improvement, and consistent service excellence across all operations.
        </p>

        {/* Sign-in Instructions */}
        <div className="bg-green-800/40 border border-green-600/50 rounded-xl p-6 mb-10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-2">
            🔐 Access Instructions
          </h3>
          <p className="text-green-100 text-sm md:text-base">
            Please use your <span className="font-semibold text-white">Outlook account</span> to 
            sign in and access company documents. Once authenticated, you can view and 
            download files based on your assigned permissions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login"
            className="bg-white hover:bg-green-50 text-green-900 font-semibold px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Sign In with Outlook
          </Link>
          <Link 
            href="/documents"
            className="bg-green-700 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg border border-green-500 transition transform hover:scale-105"
          >
            View Documents
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-green-300 mt-12">
          © 2026 Operon Middle East — An Edgenta Company. All rights reserved.
        </p>

      </div>
    </main>
  )
}