// File: src/components/Layout.tsx
import Header from "./Header";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main>{children}</main> {/* push content below header */}
        </>
    );
}