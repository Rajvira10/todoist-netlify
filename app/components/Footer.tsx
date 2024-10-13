import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Features
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Task Management
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Reminders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2024 Todoist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
