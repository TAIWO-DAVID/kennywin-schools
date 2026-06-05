import React from 'react';

export default function EnrollmentFormPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Enrollment Form</h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Previous School</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your last school attended"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </main>
  );
}
