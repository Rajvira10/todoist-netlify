import { useNavigation } from "@remix-run/react";
import { cx } from "class-variance-authority";

function GlobalLoading() {
  const navigation = useNavigation();
  const active = navigation.state !== "idle";

  return (
    <div
      role="progressbar"
      aria-valuetext={active ? "" : undefined}
      aria-hidden={!active}
      className={cx(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ease-in-out",
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{
        background:
          "linear-gradient(135deg, #667eea, #764ba2, #ff6b6b, #feb47b)",
        backgroundSize: "400% 400%",
        animation: "backgroundShift 10s ease infinite",
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Circular Spinner */}
        <svg
          className="h-16 w-16 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25 stroke-current"
            cx={12}
            cy={12}
            r={10}
            strokeWidth={4}
          ></circle>
          <path
            className="opacity-75 fill-current"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>

        {/* Glowing ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-dashed border-blue-500 animate-ping"></div>
        </div>
      </div>

      {/* Style for the background animation */}
      <style>{`
        @keyframes backgroundShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}

export { GlobalLoading };
