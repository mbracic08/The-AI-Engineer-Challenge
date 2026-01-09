"use client";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900"></div>
      
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-indigo-100/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-indigo-900/10 animate-gradient-shift"></div>
      
      {/* Very subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb08_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb08_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#37415108_1px,transparent_1px),linear-gradient(to_bottom,#37415108_1px,transparent_1px)]"></div>
      
      {/* Subtle floating blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 -right-20 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
    </div>
  );
}
