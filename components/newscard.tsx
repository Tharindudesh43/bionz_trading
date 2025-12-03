// components/NewsCard.tsx
import Image from 'next/image'; // For optimized images in Next.js
import Link from 'next/link';   // For navigation

interface NewsCardProps {
  imageUrl: string;
  title: string;
  source?: string; // Optional: e.g., "Sponsored by Genius"
  date?: string;   // Optional: e.g., "Oct 30, 2025"
  href: string;    // The URL the card links to
}

export function NewsCard({ imageUrl, title, source, date, href }: NewsCardProps) {
  return (
    <Link href={href} className="block group rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image Container */}
      <div className="relative w-full aspect-video"> {/* aspect-video for 16:9 ratio */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
        />
      </div>

      {/* Content Area */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight mb-2 transition-colors duration-200">
          {title}
        </h3>
        {source && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 leading-none">
            {source}
          </p>
        )}
        {date && (
          <p className="text-sm text-gray-500 dark:text-gray-500 leading-none">
            {date}
          </p>
        )}
      </div>
    </Link>
  );
}