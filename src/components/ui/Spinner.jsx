import React from "react";

export default function Spinner({ size = "medium" }) {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin`}
      ></div>
    </div>
  );
}