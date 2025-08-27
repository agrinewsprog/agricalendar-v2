import { Calendar } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Calendar className="text-green-600" />
              AgriCalendar
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Event Header Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
                </div>

                <div className="w-3/4 h-10 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Details Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse mt-1" />
                  <div className="flex-1">
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-wrap gap-4">
              <div className="w-40 h-12 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-12 bg-gray-200 rounded animate-pulse" />
              <div className="w-44 h-12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="w-36 h-6 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
