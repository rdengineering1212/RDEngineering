import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-primary">
      <div className="container-padding text-center">
        <div className="text-8xl md:text-9xl font-heading font-bold gradient-text mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/contact" className="btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
