import { Outlet } from "@remix-run/react";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";

const Tasks = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Tasks;
