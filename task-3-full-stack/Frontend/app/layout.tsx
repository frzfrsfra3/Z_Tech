'use client';

import React from "react";
import ClientWrapper from "@/components/ClientWrapper";
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header'; // Import your header component

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS globally
import Script from 'next/script';
import { SnackbarProvider } from 'notistack';
import './globals.css'; // or '../styles/globals.css' depending on your structure

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    
      <body>
        <SnackbarProvider maxSnack={3}>
          {/* <AuthProvider> */}
            <ClientWrapper>
              <Header />
              {children}
            </ClientWrapper>
          {/* </AuthProvider> */}
        </SnackbarProvider>
      </body>
    </html>
  );
}
