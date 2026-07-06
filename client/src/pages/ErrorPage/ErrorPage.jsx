import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="text-center mt-20">

      <h1 className="text-6xl font-bold">
        404
      </h1>

      <p>
        Page Not Found
      </p>

      <Link to="/">
        Back Home
      </Link>

    </div>
  );
};

export default ErrorPage;