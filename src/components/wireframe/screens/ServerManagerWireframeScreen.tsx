import React from "react";
import SMOverview from "@/pages/server-manager/screens/SMOverview";

export function ServerManagerWireframeScreen() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Server Manager (Wireframe)</h1>
        <p className="text-muted-foreground">Infrastructure overview wireframe.</p>
      </header>

      <section>
        <SMOverview />
      </section>
    </main>
  );
}
