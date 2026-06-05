import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div>
        <AuthProvider>{children}</AuthProvider>
      </div>
    </>
  );
};

export default layout;
