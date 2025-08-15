import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ProSidebar } from "./ProSidebar";

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      <ProSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}