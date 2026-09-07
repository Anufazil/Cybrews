import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "CYBREWS // Cybersecurity Daily",
  description: "A daily feed of cybersecurity news, sourced and referenced.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-10 pb-20 relative z-10">
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
