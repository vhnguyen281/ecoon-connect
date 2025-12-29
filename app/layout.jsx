import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "@/context/GlobalContext";
import "../assets/styles/globals.css";

export const metadata = {
  title: "EcoonConnect | Find the Perfect Rental",
  discription: "Find your dream rental property",
  keywords: "rental, find rental, find properties",
};

function layout({ children }) {
  return (
    <GlobalProvider>
      <AuthProvider>
        <html lang="en">
          <head>
            <script
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
              async
              defer
            ></script>
          </head>
          <body>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
          </body>
        </html>
      </AuthProvider>
    </GlobalProvider>
  );
}

export default layout;
