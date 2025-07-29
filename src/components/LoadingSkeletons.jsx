// Loading skeleton components for archived events

export const ArchivedEventCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-3/4"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export const ArchivedEventDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-700">
        <div className="container mx-auto">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-64"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title Skeleton */}
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>

          {/* Hero Image Skeleton */}
          <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-xl mb-8"></div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ArchivedEventsListSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mb-4 mx-auto w-80"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-96"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar Skeleton */}
        <div className="max-w-md mx-auto mb-8">
          <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <ArchivedEventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Default export for general loading
const LoadingSkeletons = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-4 border-[#BC3612] border-t-transparent"></div>
    </div>
  );
};

export default LoadingSkeletons;
