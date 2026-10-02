import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
      <div className="text-6xl">🧸</div>
      <h1 className="text-3xl font-extrabold text-charcoal-900">Page Not Found</h1>
      <p className="text-charcoal-600 text-sm max-w-sm mx-auto">
        We could not find the page you are looking for. Please return to our baby clothing catalogue.
      </p>
      <div className="pt-4">
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-charcoal-900 text-white font-semibold text-sm shadow-soft inline-block"
        >
          Return to Catalogue Home
        </Link>
      </div>
    </div>
  );
}
