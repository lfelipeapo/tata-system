import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = "mockToken12345";
    //const token = Cookies.get("token");

    if (!token) {
      router.push("/");
    }
  }, [router]);

  return children;
};

export default ProtectedRoute;

export async function getServerSideProps(context) {
  const { req } = context;
  const token = "mockToken12345";
  //const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}