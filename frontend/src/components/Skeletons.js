export function FoodCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="card p-4 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}
