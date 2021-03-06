import { Helmet } from "react-helmet";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div>
      <Helmet>
        <meta name="description" content="Page not found" />
        <title>Page not found</title>
      </Helmet>
      <ErrorMessage />
      <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}>
        Page doesn't exist!
      </p>
      <Link
        to="/"
        style={{
          display: "block",
          marginTop: "30px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        Back to main page..
      </Link>
    </div>
  );
};

export default Page404;
